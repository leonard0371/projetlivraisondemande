import React from 'react'
import './SideBar.scss'
import { Tabs, Placeholder } from 'rsuite';

const SideBar = ({ tabsData, setActiveKey }) => {
    const handleChangeKey = (key) => {
        setActiveKey(key)
    }
    return (
        <div className='sidebar-main-component'>SideBar
            {
                tabsData?.map((tab,i) => {
                    return (
                        <Tabs key={i} defaultActiveKey="1" vertical appearance="subtle" onClick={() => handleChangeKey(tab?.key)}>
                            <Tabs.Tab eventKey={tab?.key} title={tab?.title} >
                                {/* <Placeholder.Paragraph graph="image" rows={5} />
                                 */}
                                {/* {tab?.component} */}
                            </Tabs.Tab>

                        </Tabs>
                    )
                })
            }
            {/* <Tabs defaultActiveKey="1" vertical appearance="subtle">
                <Tabs.Tab eventKey="1" title="Image">
                    <Placeholder.Paragraph graph="image" rows={5} />
                </Tabs.Tab>
                <Tabs.Tab eventKey="2" title="Square">
                    <Placeholder.Paragraph graph="square" rows={5} />
                </Tabs.Tab>
                <Tabs.Tab eventKey="3" title="Circle">
                    <Placeholder.Paragraph graph="circle" rows={5} />
                </Tabs.Tab>
            </Tabs> */}
        </div>
    )
}

export default SideBar