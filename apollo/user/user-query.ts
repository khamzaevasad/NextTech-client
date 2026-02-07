import { gql } from "@apollo/client";

export const GET_SELLER = gql`
  query GetSeller($input: SellersInquiry!) {
    getSeller(memberId: $input) {
      list {
        _id
        memberType
        memberStatus
        memberAuthType
        memberPhone
        memberNick
        memberFullName
        memberImage
        memberAddress
        memberDesc
        memberArticles
        memberFollowers
        memberFollowings
        memberPoints
        memberRank
        memberWarnings
        memberBlocks
        deletedAt
        createdAt
        updatedAt
        accessToken
        storeData {
          storeName
        }
      }
      metaCounter {
        total
      }
    }
  }
`;

/* -------------------------------------------------------------------------- */
/*                                  PRODUCTS                                  */
/* -------------------------------------------------------------------------- */

export const GET_PRODUCTS = gql`
  query GetProducts($input: ProductsInquiry!) {
    getProducts(input: $input) {
      list {
        _id
        productName
        productSlug
        productDesc
        productBrand
        productPrice
        productStock
        productStatus
        productCategory
        storeId
        productSpecsKeys
        productSpecs
        productImages
        productViews
        productLikes
        productComments
        createdAt
        updatedAt
        meLiked {
          memberId
          likeRefId
          myFavorite
        }
        storeData {
          _id
          storeName
          ownerId
          storeDesc
          storeStatus
          storeAddress
          storeProductsCount
          storeRating
          storeComments
          storeViews
          storeLikes
        }
      }
      metaCounter {
        total
      }
    }
  }
`;

/* -------------------------------------------------------------------------- */
/*                                  CATEGORY                                  */
/* -------------------------------------------------------------------------- */

export const GET_CATEGORIES = gql`
  query GetCategories($input: CategoriesInquiry!) {
    getCategories(input: $input) {
      list {
        _id
        categoryName
        categorySlug
        categoryImage
        categoryDesc
        parentId
        categoryFilterKeys
        createdAt
        updatedAt
        children {
          _id
          categoryName
          categorySlug
          categoryImage
          categoryDesc
          parentId
          categoryFilterKeys
          createdAt
          updatedAt
          children {
            _id
            categoryName
            categorySlug
            categoryImage
            categoryDesc
            parentId
            categoryFilterKeys
            createdAt
            updatedAt
          }
        }
      }
      metaCounter {
        total
      }
    }
  }
`;
