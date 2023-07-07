import React, { Fragment, useEffect } from "react";
import { DataGrid } from "@material-ui/data-grid";
import "./ProductList.css";
import { useSelector, useDispatch } from "react-redux";
import { clearErrors, getAdminProduct, deleteProduct, getAdminCategory, createCategory, } from "../../actions/productAction";
import { Link } from "react-router-dom";
import { useAlert } from "react-alert";
import { Button } from "@material-ui/core";
import MetaData from "../layout/MetaData";
import EditIcon from "@material-ui/icons/Edit";
import DeleteIcon from "@material-ui/icons/Delete";
import SideBar from "./Sidebar";
import "./CategoryList.css";
import Popup from "reactjs-popup";
import { useState } from "react";

const CategoryList = ({ history }) => {
    const dispatch = useDispatch();

    const alert = useAlert();
    const [name, setName] = useState('')
    const { categories } = useSelector((state) => state.categories);


    const deleteProductHandler = (id) => {
        dispatch(deleteProduct(id));
    };

    useEffect(() => {
        dispatch(getAdminCategory());
    }, [dispatch, alert, history]);

    const columns = [
        {
            field: "id",
            headerName: "ID",
            minWidth: 350,
        },
        {
            field: "name",
            headerName: "Tên hãng",
            minWidth: 350,
            flex: 1,
        },
        {
            field: "actions",
            flex: 0.3,
            headerName: "Chỉnh sửa",
            minWidth: 150,
            type: "number",
            sortable: false,
            renderCell: (params) => {
                return (
                    <Fragment>
                        <Button onClick={() => deleteProductHandler(params.getValue(params.id, "id"))}>
                            <DeleteIcon />
                        </Button>
                    </Fragment>
                );
            },
        },
    ];

    const rows = [];
    categories &&
        categories?.forEach((item) => {
            rows.push({
                id: item._id,
                name: item.name,
            });
        });

    return (
        <Fragment>
            <MetaData title={`Tất cả sản phẩm`} />

            <div className="dashboard">
                <SideBar />
                <div className="productListContainer">
                    <h1 id="productListHeading">Tất cả hãng</h1>

                    <DataGrid
                        rows={rows}
                        columns={columns}
                        pageSize={10}
                        disableSelectionOnClick
                        className="productListTable"
                        autoHeight
                    />
                    <Popup modal trigger={<button style={{ maxWidth: 300 }} className="button" onClick={() => { }}>Thêm hãng</button>
                    }>
                        <div className="modal">
                            <input
                                className="input"
                                type="text"
                                placeholder="Tên hãng"
                                required
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                            <button className="button" onClick={() => dispatch(createCategory({ name: name }))}>Thêm hãng</button>
                        </div>
                    </Popup>

                </div>
            </div>
        </Fragment>
    );
};

export default CategoryList;