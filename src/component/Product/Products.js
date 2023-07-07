import React, { Fragment, useEffect, useState } from "react";
import "./Products.css";
import { useSelector, useDispatch } from "react-redux";
import { getProduct, clearErrors } from "../../actions/productAction";
import Loader from "../layout/Loader/Loader";
import ProductCard from "../Home/ProductCard";
import Pagination from "react-js-pagination";
import Slider from "@material-ui/core/Slider";
import Typography from "@material-ui/core/Typography";
import { useAlert } from "react-alert";
import MetaData from "../layout/MetaData";
const categories = [
    "Toàn bộ",
    "Apple",
    "Samsung",
    "Xiaomi",
    "Realme",
    "Oppo",
    "Vivo",
    "Asus",
];

const Products = ({ match }) => {
    const dispatch = useDispatch();
    const { products, loading, resultPerPage, productsCount, filteredProductsCount, error } = useSelector((state) => state.products);

    const alert = useAlert();
    const [currentPage, setCurrentPage] = useState(1);
    const [price, setPrice] = useState([0, 25000]);
    const [category, setCategory] = useState("");
    const [currentProducts, setCurrentProducts] = useState(products)
    const setCurrentPageNo = (e) => {
        setCurrentPage(e);
    };
    const priceHandler = (event, newPrice) => {
        setPrice(newPrice);
    };
    const filterProduct = (products, priceRange, selectedCategory) => {
        if (selectedCategory === categories[0]) {
            setCurrentProducts(products)
            return
        }
        const newProducts = products.filter(item => {
            const { price, category } = item;
            return price >= priceRange[0] && price <= priceRange[1] && category === selectedCategory;
        });
        setCurrentProducts(newProducts)
    }
    useEffect(() => {
        if (error) {
            alert.error(error);
        }
        filterProduct(products, price, category)
    }, [currentPage, price, category, alert, error]);
    useEffect(() => {
        dispatch(getProduct(), clearErrors());
    }, [])
    useEffect(() => {
        setCurrentProducts(products)
    }, [products])
    let count = filteredProductsCount;
    return (
        <Fragment>{loading ? <Loader /> :
            <Fragment>
                <MetaData title="Sản Phẩm-MOBILE STORE" />
                <h2 className="productsHeading">Sản phẩm</h2>
                <div className="products">
                    {currentProducts &&
                        currentProducts.map((product) => (
                            <ProductCard key={product._id} product={product} />
                        ))}
                </div>
                <div className="filterBox">
                    <Typography>Giá</Typography>
                    <Slider
                        value={price}
                        onChange={priceHandler}
                        valueLabelDisplay="auto"
                        aria-labelledby="range-slider"
                        min={0}
                        max={25000}
                    />

                    <Typography>Hãng</Typography>
                    <ul className="categoryBox">
                        {categories.map((category) => (
                            <li
                                className="category-link"
                                key={category}
                                onClick={() => setCategory(category)}
                            >
                                {category}
                            </li>
                        ))}
                    </ul>
                </div>

                {resultPerPage < count && (
                    <div className="paginationBox">
                        <Pagination
                            activePage={currentPage}
                            itemsCountPerPage={resultPerPage}
                            totalItemsCount={productsCount}
                            onChange={setCurrentPageNo}
                            nextPageText="Next"
                            prevPageText="Prev"
                            firstPageText="1st"
                            lastPageText="Last"
                            itemClass="page-item"
                            linkClass="page-link"
                            activeClass="pageItemActive"
                            activeLinkClass="pageLinkActive"
                        />

                    </div>
                )}


            </Fragment>
        }
        </Fragment>
    );

}

export default Products;
