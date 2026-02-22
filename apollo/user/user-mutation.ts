import { gql } from "@apollo/client";

/* -------------------------------------------------------------------------- */
/*                                   MEMBER                                   */
/* -------------------------------------------------------------------------- */

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

export const MEMBER_IMAGE_UPLOADER = gql`
  mutation ImageUploader($file: Upload!, $target: String!) {
    imageUploader(file: $file, target: $target)
  }
`;

export const UPDATE_MEMBER = gql`
  mutation UpdateMember($input: MemberUpdate!) {
    updateMember(input: $input) {
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
export const LIKE_TARGET_ARTICLE = gql`
  mutation LikeTargetArticle($input: String!) {
    likeTargetArticle(articleId: $input) {
      _id
      articleCategory
      articleStatus
      articleTitle
      articleContent
      articleImage
      articleViews
      articleLikes
      articleComments
      memberId
      createdAt
      updatedAt
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

/* -------------------------------------------------------------------------- */
/*                                  ARTICLES                                  */
/* -------------------------------------------------------------------------- */

export const CREATE_BOARD_ARTICLE = gql`
  mutation CreateBoardArticle($input: BoardArticleInput!) {
    createBoardArticle(input: $input) {
      _id
      articleCategory
      articleStatus
      articleTitle
      articleContent
      articleImage
      articleViews
      articleLikes
      articleComments
      memberId
      createdAt
      updatedAt
    }
  }
`;

export const IMAGE_UPLOADER = gql`
  mutation ImageUploader($file: Upload!, $target: String!) {
    imageUploader(file: $file, target: $target)
  }
`;

/* -------------------------------------------------------------------------- */
/*                                   FOLLOWS                                  */
/* -------------------------------------------------------------------------- */

export const SUBSCRIBE = gql`
  mutation Subscribe($input: String!) {
    subscribe(input: $input) {
      _id
      followingId
      followerId
      createdAt
      updatedAt
    }
  }
`;

export const UN_SUBSCRIBE = gql`
  mutation Unsubscribe($input: String!) {
    unsubscribe(input: $input) {
      _id
      followingId
      followerId
      createdAt
      updatedAt
    }
  }
`;

/* -------------------------------------------------------------------------- */
/*                                  PRODUCTS                                  */
/* -------------------------------------------------------------------------- */

export const UPDATE_PRODUCT = gql`
  mutation UpdateProduct($input: UpdateProductInput!) {
    updateProduct(input: $input) {
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

export const IMAGES_UPLOADER = gql`
  mutation ImagesUploader($files: [Upload!]!, $target: String!) {
    imagesUploader(files: $files, target: $target)
  }
`;

export const CREATE_PRODUCT = gql`
  mutation CreateProduct($input: CreateProductInput!) {
    createProduct(input: $input) {
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

/* -------------------------------------------------------------------------- */
/*                                    STORE                                   */
/* -------------------------------------------------------------------------- */

export const CREATE_STORE = gql`
  mutation CreateStore($input: StoreInput!) {
    createStore(input: $input) {
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
      storeLocation
      storeLogo
      storePhone
    }
  }
`;

export const UPDATE_STORE = gql`
  mutation UpdateStore($input: StoreUpdate!) {
    updateStore(input: $input) {
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
      storeLocation
      storeLogo
      storePhone
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
`;
