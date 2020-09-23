import React, { useState, useEffect } from "react";
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
import CIcon from "@coreui/icons-react";

import ReloadIcon from "../icons/ReloadIcon";

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
  colors: Color[];
  images: string[];
  ratingData: {
    stars: number;
    ratings: Rating[];
  };
  createdAt: Date;
}

export interface ProductTableItem {
  title: string;
  price: number;
  quantity: number;
  type: ProductType; // productType
  // rating: number;
  // createdAt: Date;
}

const productFields = [
  { key: "title", _classes: "font-weight-bold" },
  { key: "type" },
  { key: "quantity" },
  { key: "price" },
];

const Products = () => {
  const [products, setProducts] = useState<ProductTableItem[]>([
    {
      title: "Red Printed T-Shirt",
      price: 24.99,
      quantity: 32,
      type: ProductType.Shirt,
    },
  ]);
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [productType, setproductType] = useState<string>("");
  const [quantity, setQuantity] = useState<number>(1);
  const [price, setPrice] = useState<number>(0);
  const [images, setImages] = useState<string[]>([]);
  const [imageFiles, setImageFiles] = useState<FileList | null>();
  const saveImage = (result: string) => {
    setImages([...images, result]);
  };
  useEffect(() => {
    setImages([]);
    console.log(imageFiles);
    if (!imageFiles) return;
    let imgStrings: string[] = [];
    const test = (result: string) => {
      console.log(result);
      imgStrings = [...imgStrings, result];
    };
    const test2 = async () => {
      await Promise.all(
        Array.from(imageFiles).map(async (imageFile: File) =>
          // getBase64(imageFile, saveImage)
          {
            await getBase64(imageFile, test);
            console.log("hello");
          }
        )
      ).then(() => console.log(imgStrings));
    };
    test2();
  }, [imageFiles]);

  useEffect(() => {
    console.log(images);
  }, [images]);

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
                    />
                  </CFormGroup>
                  <CFormGroup>
                    <CLabel htmlFor="products__descriptionInput">
                      Description
                    </CLabel>
                    <CTextarea
                      id="products__descriptionInput"
                      placeholder="Enter Description..."
                    />
                  </CFormGroup>
                  <CFormGroup>
                    <CLabel htmlFor="products__typeInput">Type</CLabel>
                    <CSelect id="products__typeInput">
                      {Object.values(ProductType).map((pType) => (
                        <option value={pType}>{pType}</option>
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
            </CCard>
          </CCol>
        </CRow>
        <CRow>
          <CCol xs={12}>
            <CCard>
              <CCardHeader>
                Products
                <div className="card-header-actions product__tableActions">
                  <CButton color="link" className="card-header-action">
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
