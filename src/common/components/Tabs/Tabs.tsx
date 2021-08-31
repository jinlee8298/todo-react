import { ReactElement, FC, useState } from "react";
import StyledTabs from "./Tabs.style";
import Tab, { TabProps } from "./Tab/Tab";

type TabsProps = {
  children: ReactElement<TabProps>[];
  renderActiveTabPanelOnly?: boolean;
};

type TabsType = {
  Tab: typeof Tab;
} & FC<TabsProps>;

const Tabs: TabsType = ({ children, renderActiveTabPanelOnly = false }) => {
  const [selectedTab, setSelectedTab] = useState<number>(0);
  const tabList = children.map(({ props }) => ({
    title: props.title,
    disabled: props.disabled,
    id: props.id,
  }));

  const switchTab = (index: number) => {
    setSelectedTab(index);
  };

  const tabRender = renderActiveTabPanelOnly
    ? children[selectedTab]
    : children.map(({ props }, index) => (
        <Tab {...props} key={props.id} disabled={index !== selectedTab} />
      ));

  return (
    <StyledTabs>
      <div className="tab-list">
        {tabList.map((tab, index) => (
          <span
            key={tab.id}
            onClick={() => switchTab(index)}
            className={index === selectedTab ? "active" : ""}
          >
            {tab.title}
          </span>
        ))}
      </div>
      <div className="tab-container">{tabRender}</div>
    </StyledTabs>
  );
};

Tabs.Tab = Tab;

export default Tabs;
