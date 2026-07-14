import CommonHelper from "../Helpers/CommonHelper";

interface IColConfigBySize {
  size?: number;
}

export interface IColConfig {
  xs?: IColConfigBySize;
  sm?: IColConfigBySize;
  md?: IColConfigBySize;
  lg?: IColConfigBySize;
  xl?: IColConfigBySize;
}

export interface IColTcd {
  config?: IColConfig;

  children?: any;
  className?: string;
}

export default function ColTcd(props: IColTcd) {
  const prefixClass = "col-span-";

  function getColConfigClass() {
    let configTemp = "";
    if (props.config?.xs) {
      configTemp = CommonHelper.concatClassNames(
        configTemp,
        `${prefixClass}${props.config?.xs.size}`
      );
    } else {
      configTemp = CommonHelper.concatClassNames(
        configTemp,
        `${prefixClass}12`
      );
    }
    if (props.config?.sm) {
      configTemp = CommonHelper.concatClassNames(
        configTemp,
        `sm:${prefixClass}${props.config?.sm.size}`
      );
    }
    if (props.config?.md) {
      configTemp = CommonHelper.concatClassNames(
        configTemp,
        `md:${prefixClass}${props.config?.md.size}`
      );
    }
    if (props.config?.lg) {
      configTemp = CommonHelper.concatClassNames(
        configTemp,
        `lg:${prefixClass}${props.config?.lg.size}`
      );
    }
    if (props.config?.xl) {
      configTemp = CommonHelper.concatClassNames(
        configTemp,
        `xl:${prefixClass}${props.config?.xl.size}`
      );
    }

    return configTemp;
  }

  // function getColConfigClass2() {
  //   let configTemp = "";
  //   if (props.config?.xs) {
  //     configTemp = `col-span-${props.config?.xs.size}`;
  //   } else {
  //     configTemp = "col-span-12";
  //   }
  //   if (props.config?.sm) {
  //     configTemp += ` sm:col-span-${props.config?.sm.size}`;
  //   }
  //   if (props.config?.md) {
  //     configTemp += ` md:col-span-${props.config?.md.size}`;
  //   }
  //   if (props.config?.lg) {
  //     configTemp += ` lg:col-span-${props.config?.lg.size}`;
  //   }
  //   if (props.config?.xl) {
  //     configTemp += ` xl:col-span-${props.config?.xl.size}`;
  //   }

  //   return configTemp;
  // }
  // const temp = getColConfigClass();
  return (
    <div
      className={CommonHelper.concatClassNames(
        getColConfigClass(),
        props.className
      )}
    >
      {props.children}
    </div>
  );
  // return (
  //   <div
  //     className={
  //       "col-span-12 sm:col-span-6 md:col-span-4 xl:col-span-3 border border-cyan-400"
  //     }
  //   >
  //     {props.children}
  //   </div>
  // );
}
