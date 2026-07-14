import { useState } from "react";

import CommonConst from "@src/Cores/Constants/CommonConst";
import { DataTypeEnum } from "@src/Cores/Enums/CommonEnum";
import CommonHelper from "@src/Cores/Helpers/CommonHelper";
import { useCommonHelper } from "@src/Cores/Hooks";
import { PaginationModel, PropertyModel } from "@src/Cores/Models/CommonModels";
import ButtonTcd from "@src/Cores/ShareComponents/ButtonTcd";
import InputNumberTcd from "@src/Cores/ShareComponents/InputNumberTcd";
import LinkTcd from "@src/Cores/ShareComponents/LinkTcd";
import SelectTcd from "@src/Cores/ShareComponents/SelectTcd";
import { TableRefTcd } from "@src/Cores/ShareComponents/Table/TableCommon";

const listPageSize = [
  { value: 10, label: "10 / Page" },
  { value: 20, label: "20 / Page" },
  { value: 50, label: "50 / Page" },
  { value: 100, label: "100 / Page" },
  { value: -1, label: "All Page" },
];

export interface PaginationTcdModel {
  pageSize?: number;
  pageIndex?: number;
  pagination?: PaginationModel;

  isShowTotal?: boolean;
  isShowNavigate?: boolean;
  isShowPageSize?: boolean;
  isShowPageIndexInput?: boolean;
  isOffRedirect?: boolean;
  isOffUrlParam?: boolean;
  isStyleInCard?: boolean;
  isShowTableSetting?: boolean;

  tableApi?: TableRefTcd<any> | null;
  onChange?: (
    pageIndexParam: number,
    pageSizeParam: number,
    urlRedirect?: string
  ) => void;
}

export default function PaginationTcd(props: Readonly<PaginationTcdModel>) {
  //#region states
  const isOffRedirect = props.isOffRedirect !== false;
  const pagination = props.pagination ?? CommonConst.paginationDefault;
  const configUrlReplace: PropertyModel[] = [
    {
      name: "pageIndex",
      type: DataTypeEnum.number,
      valueDefault: 1,
    },
  ];
  const pageIndex = props.pageIndex ?? 0;
  const pageSize = props.pageSize ?? 1;
  const totalPages =
    pageSize > 0 && pagination.totalRecords > 0
      ? Math.ceil(pagination.totalRecords / pageSize)
      : 1;
  const disabledLast = pageIndex === totalPages;
  const disabledNext = pageIndex >= totalPages;
  const disabledPrevious = pageIndex <= 1;
  const disabledFirst = pageIndex === 1;
  const [pageIndexInput, setPageIndexInput] = useState<number | undefined>();
  const useCommonHelperState = useCommonHelper();

  const urlFirst = disabledFirst
    ? ""
    : useCommonHelperState.getUrlByFilter(configUrlReplace, {
        pageIndex: 1,
      });
  const urlNext = disabledNext
    ? ""
    : useCommonHelperState.getUrlByFilter(configUrlReplace, {
        pageIndex: pageIndex + 1,
      });
  const urlPrevious = disabledPrevious
    ? ""
    : useCommonHelperState.getUrlByFilter(configUrlReplace, {
        pageIndex: pageIndex - 1,
      });
  const urlLast = disabledLast
    ? ""
    : useCommonHelperState.getUrlByFilter(configUrlReplace, {
        pageIndex: totalPages,
      });

  //#endregion

  //#region functions
  function handlePrevious() {
    props.onChange?.(pageIndex - 1, pageSize);
  }
  function handleFirst() {
    props.onChange?.(1, pageSize);
  }
  function handleNext() {
    props.onChange?.(pageIndex + 1, pageSize);
  }
  function handleLast() {
    props.onChange?.(totalPages, pageSize);
  }
  //#endregion

  //#region private components
  function totalQueryComponent() {
    return (
      <div style={{ minWidth: "140px" }} className="">
        Tổng: {pagination.totalRecordsReturn}/{pagination.totalRecords} bản ghi
      </div>
    );
  }

  function navigateComponent() {
    return (
      <div className="flex">
        <LinkTcd
          href={urlFirst}
          disabled={disabledFirst}
          isOffRedirect={isOffRedirect}
          isOffUrlParam={props.isOffUrlParam}
        >
          <ButtonTcd
            icon="fas fa-angle-double-left"
            isRounded
            isNoBackground
            onClick={handleFirst}
            color={
              disabledFirst
                ? CommonConst.classColor.secondary
                : CommonConst.classColor.primary
            }
            disabled={disabledFirst}
          />
        </LinkTcd>
        <LinkTcd
          href={urlPrevious}
          disabled={disabledPrevious}
          isOffRedirect={isOffRedirect}
          isOffUrlParam={props.isOffUrlParam}
        >
          <ButtonTcd
            icon="fas fa-angle-left"
            isRounded
            isNoBackground
            onClick={handlePrevious}
            color={
              disabledPrevious
                ? CommonConst.classColor.secondary
                : CommonConst.classColor.primary
            }
            disabled={disabledPrevious}
          />
        </LinkTcd>
        <ButtonTcd
          isRounded
          isNoBackground
          color={CommonConst.classColor.secondary}
          disabled={true}
          text={pageIndex.toString()}
        />
        <LinkTcd
          href={urlNext}
          disabled={disabledNext}
          isOffRedirect={isOffRedirect}
          isOffUrlParam={props.isOffUrlParam}
        >
          <ButtonTcd
            icon="fas fa-angle-right"
            isRounded
            isNoBackground
            color={
              disabledNext
                ? CommonConst.classColor.secondary
                : CommonConst.classColor.primary
            }
            disabled={disabledNext}
            onClick={handleNext}
          />
        </LinkTcd>
        <LinkTcd
          href={urlLast}
          disabled={disabledLast}
          isOffRedirect={isOffRedirect}
          isOffUrlParam={props.isOffUrlParam}
        >
          <ButtonTcd
            icon="fas fa-angle-double-right"
            isRounded
            isNoBackground
            onClick={handleLast}
            color={
              disabledLast
                ? CommonConst.classColor.secondary
                : CommonConst.classColor.primary
            }
            disabled={disabledLast}
          />
        </LinkTcd>
      </div>
    );
  }

  function showPageSizeComponent() {
    return (
      <div style={{ width: "150px" }}>
        <SelectTcd
          options={listPageSize}
          value={pageSize}
          onChange={(e: any) => {
            props.onChange?.(1, e.value);
          }}
        ></SelectTcd>
      </div>
    );
  }

  function showPageIndexInputComponent() {
    return (
      <div className="flex items-center gap-1">
        <div>Đi đến </div>
        <div style={{ width: "70px" }}>
          <InputNumberTcd
            showButtons={false}
            value={pageIndexInput}
            min={1}
            max={10000000}
            onChange={(e) => {
              setPageIndexInput(e.value ?? undefined);
            }}
            onPressEnter={() => {
              if (pageIndexInput !== undefined) {
                if (pageIndexInput < 1) {
                  props.onChange?.(1, pageSize);
                } else {
                  props.onChange?.(pageIndexInput, pageSize);
                }
                setPageIndexInput(undefined);
              }
            }}
          ></InputNumberTcd>
        </div>
        <div>/{totalPages} trang </div>
      </div>
    );
  }
  //#endregion

  //#region main render

  return (
    <div
      className={CommonHelper.concatClassNames(
        "flex bg-white p-2 items-center gap-3 rounded-md flex-wrap justify-between",
        props.isStyleInCard ? "px-0" : "px-3"
      )}
    >
      <div className="flex bg-white p-2 gap-3 items-center flex-wrap">
        {props.isShowTotal !== false && totalQueryComponent()}
        {props.isShowNavigate !== false && navigateComponent()}
        {props.isShowPageSize !== false && showPageSizeComponent()}
        {props.isShowPageIndexInput !== false && showPageIndexInputComponent()}
      </div>
      <div className="flex flex-auto justify-end">
        {/* {props.isShowTableSetting !== false && (
          <TableSettingTcd tableApi={props.tableApi}></TableSettingTcd>
        )} */}
      </div>
    </div>
  );
  //#endregion
}
