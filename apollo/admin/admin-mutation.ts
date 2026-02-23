import { gql } from "@apollo/client";

/* -------------------------------------------------------------------------- */
/*                                   MEMBERS                                  */
/* -------------------------------------------------------------------------- */
export const UPDATE_MEMBER_BY_ADMIN = gql`
  mutation UpdateMemberByAdmin($input: MemberUpdate!) {
    updateMemberByAdmin(input: $input) {
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
`;

/* -------------------------------------------------------------------------- */
/*                                  PRODUCTS                                  */
/* -------------------------------------------------------------------------- */

export const UPDATE_PRODUCTS_BY_ADMIN = gql`
  mutation UpdateProductByAdmin($input: UpdateProductInputAdmin!) {
    updateProductByAdmin(input: $input) {
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
    }
  }
`;
