import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

import PageStatusCpn from "@src/Cores/Components/PageStatus/PageStatusCpn";
import { CommonConst } from "@src/Cores/Constants";
import { PageStatusEnum } from "@src/Cores/Enums/CommonEnum";
import { DateTimeHelper, PostHelper } from "@src/Cores/Helpers";
import { PaginationModel } from "@src/Cores/Models/CommonModels";
import { CorePostCategoryService, CorePostService } from "@src/Cores/Services";
import { CorePostCategoryEntity } from "@src/Cores/Services/Admin/Post/CorePostCategoryService";
import { PostViewModel } from "@src/Cores/Services/Admin/Post/CorePostService";
import {
  ContainerTcd,
  ContentTcd,
  PaginationTcd,
} from "@src/Cores/ShareComponents";

export default function PostCategoryPage() {
  //#region Constants
  const router = useRouter();
  //#endregion

  //#region states
  const [filter, set_filter] = useState({
    pageIndex: 1,
    pageSize: 10,
    isRelativeSearch: true,
  });
  const [pagination, setPagination] = useState<PaginationModel | undefined>(
    CommonConst.paginationDefault
  );
  const [categoryData, set_categoryData] = useState<
    CorePostCategoryEntity | undefined
  >({});
  const [isLoadList, set_isLoadList] = useState(false);
  const [listData, set_listData] = useState<PostViewModel[] | undefined>([]);
  //#endregion

  //#region useEffects
  useEffect(() => {
    if (router.isReady) {
      fun_initData();
    }
  }, [router.asPath]);
  //#endregion

  //#region functions
  function fun_initData() {
    const var_filter = {
      ...filter,
      urlFriendlyOfCategory: router.query.id,
    };
    fun_getList(var_filter);
    CorePostCategoryService.GetByUrlFriendly(router.query.id as string).then(
      (res) => {
        if (res.isSuccess) {
          set_categoryData(res.data);
        }
      }
    );
  }

  function fun_getList(filterParam?: ObjectModel) {
    filterParam ??= { ...filter };
    CorePostService.GetListOverview(filterParam).then((res) => {
      if (res.isSuccess) {
        set_listData(res.data);
        setPagination(res.pagination);
        set_isLoadList(true);
      }
    });
  }

  function fun_handlePaginationChange(pageIndex: number, pageSize: number) {
    const val_filter = {
      ...filter,
      pageIndex: pageIndex,
      pageSize: pageSize,
    };
    fun_getList(val_filter);
    set_filter(val_filter);
  }
  //#endregion

  return (
    <>
      <ContainerTcd>
        <ContentTcd title={categoryData?.name}>
          {isLoadList && listData?.length === 0 && (
            <PageStatusCpn pageStatus={PageStatusEnum.noData}></PageStatusCpn>
          )}
          <ul className="tcd-danhmuc-ul mb-4">
            {listData?.map((item, i) => {
              return (
                <li key={item.corePostId}>
                  <div className="tcd-danhmuc-item">
                    <h3 className="tcd-post-title mt-4">
                      <Link href={PostHelper.getUrlDetail(item)}>
                        {item.name}
                      </Link>
                    </h3>
                    <div>
                      <pre className="tcd-post-description">
                        {item.description}
                      </pre>
                      <em>
                        Thời gian đăng tin:{" "}
                        {DateTimeHelper.getDateTimeShortString(item.insertTime)}
                      </em>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
          {(pagination?.totalPages ?? 0) > 1 && (
            <PaginationTcd
              pagination={pagination}
              pageIndex={filter.pageIndex}
              pageSize={filter.pageSize}
              isOffRedirect
              isShowPageSize={false}
              isShowTableSetting={false}
              onChange={fun_handlePaginationChange}
            ></PaginationTcd>
          )}
        </ContentTcd>
      </ContainerTcd>
    </>
  );
}
