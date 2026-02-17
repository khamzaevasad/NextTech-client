import { gql } from "@apollo/client";

export const LOGIN = gql`
  mutation Login($input: LoginInput!) {
    login(input: $input) {
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

export const SIGNUP = gql`
  mutation Signup($input: MemberInput!) {
    signup(input: $input) {
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
/*                                    LIKES                                   */
/* -------------------------------------------------------------------------- */
export const LIKE_TARGET_PRODUCT = gql`
  mutation LikeTargetProduct($input: String!) {
    likeTargetProduct(productId: $input) {
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

export const LIKE_TARGET_STORE = gql`
  mutation LikeTargetStore($input: String!) {
    likeTargetStore(storeId: $input) {
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
      storeLocation
    }
  }
`;

/* -------------------------------------------------------------------------- */
/*                                  COMMENTS                                  */
/* -------------------------------------------------------------------------- */
export const CREATE_COMMENT = gql`
  mutation CreateComment($input: CommentInput!) {
    createComment(input: $input) {
      _id
      commentStatus
      commentGroup
      commentContent
      commentRefId
      memberId
      createdAt
      updatedAt
    }
  }
`;
