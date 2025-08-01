import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import './TabComponent.scss'

function TabComponent({tabData,defaultActiveKey}) {
    
  return (
    <>
    <div className='tabsContainer'>
     <Tabs
      defaultActiveKey={defaultActiveKey}
      transition={true}
      id="noanim-tab-example"
      className="tab-component-style"
      justify
    >
    {tabData.map((tabData, index)=>(
   
      <Tab eventKey={tabData?.eventKey} title={tabData?.title}>
        {tabData?.content}
      </Tab>
   
    ))}
     </Tabs>
     </div>
    </>
  );
}

export default TabComponent;