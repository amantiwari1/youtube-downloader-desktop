import React, { useContext } from 'react';
import { Card } from './Card';
import { Input } from "./Input"
import { ThemeContext } from "../App";
import { Col, Row } from "react-bootstrap";

 



const Main = () => {

    const {
        AllDetail,
        SetAllDetail,
        state,
        dispatch
    } = useContext(ThemeContext)


    React.useEffect(() => {
        window.eel.Get_Path_Folder()((getpath: string) => {
            dispatch({type: 'setPath', data: getpath})
        })
    }, [dispatch])



    React.useEffect(() => {
        type Dict = { [key: string]: any };
        const totalfilesize: Dict = {}
        var All_Data_Quality: Array<Array<string>> = [] 
        AllDetail.map((data: any) => {
            All_Data_Quality.push(Object.keys(data.videoquality))
            return 0;
        })
        window.eel.All_Quality_Match(All_Data_Quality)((data: any) => {
            data.map((quality: string) => {

                AllDetail.map((data: any) => {
                    if (!(quality in totalfilesize)) {
                        totalfilesize[quality] = 0
                    }
                    totalfilesize[quality] = totalfilesize[quality] + data.videoquality[quality].filesize
                    return 0;
                })
                return 0;
            })

            dispatch({type:'AllListOfQuaility', data: data})
            dispatch({type:'ChangeQuality', data: { quality: data[0], totalfilesize: totalfilesize }})

        })
    }, [AllDetail, dispatch])

    function formatBytes(a: any, b = 2) { if (0 === a) return "0 Bytes"; const c = 0 > b ? 0 : b, d = Math.floor(Math.log(a) / Math.log(1024)); return parseFloat((a / Math.pow(1024, d)).toFixed(c)) + " " + ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"][d] }





    const HandnleQuality = (quality: any) => {

        dispatch({type:'UpdateQuality', data: quality})


    }
    return (
        <Row>
            <Col xs={12} >
                <Input />
            </Col>
            <Col xs={12}>

                <Row>
                    <br />
                    <Col xs={12}>
                        {
                            state.isError.isError && <p>{state.isError.text}</p>
                        }
                    </Col> 

                    <Col xs={12}>
                        {
                            state.PlayListLoading && <p>Please wait.. because your link are playlist. it maybe longer time</p>
                        }
                    </Col>

                    <Col xs={12}>
                        {
                            state.AllListOfQuaility.length > 0 &&
                            <Row>

                                <Col xs={3}>
                                    <label>Overall FileSize : </label>
                                </Col>

                                <Col xs={3}>

                                    <p>{formatBytes(state.ChangeQuality.totalfilesize[state.ChangeQuality.quality])}</p>
                                </Col>

                                <Col xs={3}>

                                    <label>Overall Quality : </label>
                                </Col>

                                <Col xs={3}>

                                    <select value={state.ChangeQuality.quality} onChange={e => HandnleQuality(e.target.value)}>
                                        {
                                            state.AllListOfQuaility.map((quality: string) => (
                                                <option key={quality} >{quality}</option>
                                            ))
                                        }
                                    </select>
                                </Col>
 
                            </Row>
                        }
                    </Col>
                </Row>
            </Col>

            <Col xs={12}>
                <>
                    {
                        AllDetail.map((data: any) => (
                            <Card key={data.title} handleRemoveItem={SetAllDetail} path={state.Path} data={data} />
                        ))
                    } 
                    {
                        state.CardLoading && <h1>*******Loading******</h1>
                    }
                </>
            </Col>


        </Row>
    );

}

export default Main;
