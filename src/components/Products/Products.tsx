import React, { useState, useEffect, ChangeEvent } from "react";
import getBase64 from "../../helpers/getBase64";

import "./Products.css";
import {
  CContainer,
  CBadge,
  CCard,
  CCardBody,
  CCardHeader,
  CCardFooter,
  CCol,
  CDataTable,
  CRow,
  CButton,
  CForm,
  CFormGroup,
  CLabel,
  CInput,
  CTextarea,
  CInputFile,
  CInputRadio,
  CSelect,
  CInputGroup,
  CLink,
} from "@coreui/react";

import ReloadIcon from "../icons/ReloadIcon";

const { REACT_APP_SERVER_URL } = process.env;

// Enum of colors (Keep consistent with server side)
export enum Color {
  White = "white",
  Black = "black",
  Red = "red",
  Orange = "orange",
  Yellow = "yellow",
  Green = "green",
  Blue = "blue",
  Purple = "purple",
  Brown = "brown",
  Gray = "gray",
  Pink = "pink",
}

// Enum of product types (Keep consistent with server side)
export enum ProductType {
  Jacket = "Jacket",
  Shirt = "Shirt",
  Pants = "Pants",
  Watch = "Watch",
  Footwear = "Footwear",
  Other = "Other",
}

export interface Rating {
  user: string;
  rating: number;
}

export interface IProduct {
  title: string;
  description: string;
  price: number;
  quantity: number;
  productType: ProductType;
  colors?: Color[];
  images: string[];
  ratingData?: {
    stars: number;
    ratings: Rating[];
  };
  createdAt?: Date;
}

export interface ProductTableItem {
  title: string;
  price: number;
  quantity: number;
  productType: ProductType; // productType
  // rating: number;
  // createdAt: Date;
}

const productFields = [
  { key: "title", _classes: "font-weight-bold" },
  { key: "productType" },
  { key: "quantity" },
  { key: "price" },
];

const Products = () => {
  const [products, setProducts] = useState<ProductTableItem[]>([]);
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [productType, setProductType] = useState<ProductType>(
    ProductType.Jacket
  );
  const [quantity, setQuantity] = useState<number>(1);
  const [price, setPrice] = useState<number>(0);
  const [images, setImages] = useState<string[]>([]);
  const [imageFiles, setImageFiles] = useState<FileList | null>();
  useEffect(() => {
    setImages([]);
    if (!imageFiles) return;
    let imgStrings: string[] = [];

    const saveImageStrings = (result: string) => {
      imgStrings = [...imgStrings, result];
      setImages(imgStrings);
    };

    const imgToB64Arr = async () => {
      await Promise.all(
        Array.from(imageFiles).map(async (imageFile: File) =>
          // getBase64(imageFile, saveImage)
          {
            await getBase64(imageFile, saveImageStrings);
          }
        )
      );
    };
    imgToB64Arr();
  }, [imageFiles]);

  useEffect(() => {
    refreshProducts();
  }, []);

  const addProduct = async () => {
    try {
      const bodyObj: IProduct = {
        title,
        description,
        productType,
        price,
        quantity,
        images,
      };
      const body = JSON.stringify(bodyObj);
      const res = await fetch(`${REACT_APP_SERVER_URL}/products/`, {
        method: "POST",
        body,
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await res.json();
      console.log(data);
      refreshProducts();
    } catch (error) {
      console.log(error);
    }
  };

  const refreshProducts = async () => {
    try {
      const res = await fetch(`${REACT_APP_SERVER_URL}/products/`);
      const data = await res.json();
      setProducts(data);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="products">
      <CContainer>
        <CRow>
          <CCol xs={12}>
            <CCard>
              <CCardHeader>Add Product</CCardHeader>
              <CCardBody>
                <CForm>
                  <CFormGroup>
                    <CLabel htmlFor="products__titleInput">Title</CLabel>
                    <CInput
                      id="products__titleInput"
                      placeholder="Enter Title..."
                      value={title}
                      onChange={(e: ChangeEvent<HTMLInputElement>) =>
                        setTitle(e.target.value)
                      }
                    />
                  </CFormGroup>
                  <CFormGroup>
                    <CLabel htmlFor="products__descriptionInput">
                      Description
                    </CLabel>
                    <CTextarea
                      id="products__descriptionInput"
                      placeholder="Enter Description..."
                      value={description}
                      onChange={(e: ChangeEvent<HTMLInputElement>) =>
                        setDescription(e.target.value)
                      }
                    />
                  </CFormGroup>
                  <CFormGroup>
                    <CLabel htmlFor="products__typeInput">Type</CLabel>
                    <CSelect
                      id="products__typeInput"
                      value={productType}
                      onChange={(e: ChangeEvent<HTMLSelectElement>) =>
                        setProductType(e.target.value as ProductType)
                      }
                    >
                      {Object.values(ProductType).map((pType) => (
                        <option key={pType} value={pType}>
                          {pType}
                        </option>
                      ))}
                    </CSelect>
                  </CFormGroup>
                  <CRow>
                    <CCol xs={6}>
                      <CFormGroup>
                        <CLabel htmlFor="products__quantityInput">
                          Quantity
                        </CLabel>
                        <CInput
                          id="products__quantityInput"
                          type="number"
                          placeholder="Enter Quantity..."
                          min={1}
                          step={1}
                          value={quantity}
                          onChange={(e: ChangeEvent<HTMLInputElement>) =>
                            setQuantity(e.target.valueAsNumber)
                          }
                        />
                      </CFormGroup>
                    </CCol>
                    <CCol xs={6}>
                      <CFormGroup>
                        <CLabel htmlFor="products__priceInput">Price</CLabel>
                        <CInput
                          id="products__priceInput"
                          placeholder="Enter Price..."
                          type="number"
                          min={0}
                          step={0.01}
                          value={price}
                          onChange={(e: ChangeEvent<HTMLInputElement>) =>
                            setPrice(e.target.valueAsNumber)
                          }
                        />
                      </CFormGroup>
                    </CCol>
                  </CRow>
                  <CFormGroup>
                    <CLabel>Images</CLabel>
                    <CInputGroup>
                      <CInputFile
                        id="products__imagesInput"
                        name="products__imagesInput"
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                          setImageFiles(e.target.files)
                        }
                        multiple
                        custom
                      />
                      <CLabel
                        htmlFor="products__imagesInput"
                        variant="custom-file"
                      >
                        Choose File
                      </CLabel>
                    </CInputGroup>
                  </CFormGroup>
                </CForm>
              </CCardBody>
              <CCardFooter>
                <CButton onClick={addProduct} color="primary">
                  Submit
                </CButton>
              </CCardFooter>
            </CCard>
          </CCol>
        </CRow>
        <CRow>
          <CCol xs={12}>
            <CCard>
              <CCardHeader>
                Products
                <div className="card-header-actions product__tableActions">
                  <CButton
                    color="link"
                    className="card-header-action"
                    onClick={refreshProducts}
                  >
                    <ReloadIcon />
                  </CButton>
                </div>
              </CCardHeader>

              <CCardBody>
                <CDataTable
                  items={products}
                  fields={productFields}
                  itemsPerPage={100}
                  columnFilter
                  hover
                  sorter
                  pagination
                />
              </CCardBody>
            </CCard>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  );
};

export default Products;
