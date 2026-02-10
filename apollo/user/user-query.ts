import { gql } from "@apollo/client";
/* -------------------------------------------------------------------------- */
/*                                  PRODUCTS                                  */
/* -------------------------------------------------------------------------- */

export const GET_PRODUCT = gql`
  query GetProduct($input: String!) {
    getProduct(input: $input) {
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
        storeLogo
      }
      meLiked {
        memberId
        likeRefId
        myFavorite
      }
    }
  }
`;

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

export const GET_FILTER_OPTIONS = gql`
  query GetFilterOptions($categoryId: String!) {
    getFilterOptions(categoryId: $categoryId) {
      brands
      specOptions
      filterKeys
    }
  }
`;
/* -------------------------------------------------------------------------- */
/*                                    STORE                                   */
/* -------------------------------------------------------------------------- */
export const GET_STORES = gql`
  query GetStores($input: StoresInquiry!) {
    getStores(memberId: $input) {
      list {
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
        storeLogo
        ownerData {
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
        }
        meLiked {
          memberId
          likeRefId
          myFavorite
        }
        storeLogo
      }
      metaCounter {
        total
      }
    }
  }
`;

/* -------------------------------------------------------------------------- */
/*                                   MEMBER                                   */
/* -------------------------------------------------------------------------- */
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
        meFollowed {
          followingId
          followerId
          myFollowing
        }
      }
      metaCounter {
        total
      }
    }
  }
`;
