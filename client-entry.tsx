import { ReactElement, TableHTMLAttributes } from "react";
import { GpuStatView } from "./src/components/GpuStatView";

declare const growiFacade: any;

interface CustomTableProps extends TableHTMLAttributes<HTMLTableElement> {
  className?: string;
  children?: React.ReactNode;
}

type TableComponent = (props: CustomTableProps) => ReactElement;

const activate = (): void => {
  if (growiFacade == null || growiFacade.markdownRenderer == null) {
    return;
  }

  const { optionsGenerators } = growiFacade.markdownRenderer;

  const originalCustomViewOptions = optionsGenerators.customGenerateViewOptions;

  optionsGenerators.customGenerateViewOptions = (...args: any[]): any => {
    const options = originalCustomViewOptions
      ? originalCustomViewOptions(...args)
      : optionsGenerators.generateViewOptions(...args);

    // 元のtableコンポーネントを保存
    const OriginalTableComponent: TableComponent = options.components.table;

    // 新しいtableコンポーネントで上書き
    options.components.table = (props: CustomTableProps): ReactElement => {
      // 特定のクラスがあるかチェック
      if (props.className?.includes("gpu-stat")) {
        return <GpuStatView {...props} />;
      }

      // それ以外は元のコンポーネントをそのまま使用
      return <OriginalTableComponent {...props} />;
    };

    return options;
  };
};

const deactivate = (): void => {};

// register activate
if ((window as any).pluginActivators == null) {
  (window as any).pluginActivators = {};
}
(window as any).pluginActivators["growi-plugin-gpu-stat"] = {
  activate,
  deactivate,
};
