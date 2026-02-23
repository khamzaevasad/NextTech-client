import { gql } from "@apollo/client";

/* -------------------------------------------------------------------------- */
/*                                   MEMBERS                                  */
/* -------------------------------------------------------------------------- */
export const GET_ALL_MEMBERS_BY_ADMIN = gql`
  query GetAllMembersByAdmin($input: MembersInquiry!) {
    getAllMembersByAdmin(input: $input) {
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

export const GET_ALL_PRODUCTS_BY_ADMIN = gql`
  query GetAllProductsByAdmin($input: AllProductsInquiry!) {
    getAllProductsByAdmin(input: $input) {
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
        }
      }
      metaCounter {
        total
      }
    }
  }
`;
