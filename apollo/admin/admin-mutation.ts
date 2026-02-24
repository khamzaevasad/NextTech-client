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

/* -------------------------------------------------------------------------- */
/*                                    STORE                                   */
/* -------------------------------------------------------------------------- */

export const UPDATE_STORE_BY_ADMIN = gql`
  mutation UpdateStoreByAdmin($input: StoreUpdateAdmin!) {
    updateStoreByAdmin(input: $input) {
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
`;

/* -------------------------------------------------------------------------- */
/*                                  COMMUNITY                                 */
/* -------------------------------------------------------------------------- */

export const UPDATE_BOARD_ARTICLE_BY_ADMIN = gql`
  mutation UpdateBoardArticleByAdmin($input: BoardArticleUpdate!) {
    updateBoardArticleByAdmin(input: $input) {
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

export const REMOVE_BOARD_ARTICLE_BY_ADMIN = gql`
  mutation RemoveBoardArticleByAdmin($input: String!) {
    removeBoardArticleByAdmin(articleId: $input) {
      _id
      articleCategory
      articleStatus
      articleTitle
      articleContent
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
/*                                     CS                                     */
/* -------------------------------------------------------------------------- */

export const CREATE_NOTICE = gql`
  mutation CreateNotice($input: NoticeInput!) {
    createNotice(input: $input) {
      _id
      noticeTitle
      noticeStatus
      noticeContent
      memberId
      noticeViews
      createdAt
      updatedAt
    }
  }
`;

export const UPDATE_NOTICE = gql`
  mutation UpdateNotice($input: UpdateNotice!) {
    updateNotice(input: $input) {
      _id
      noticeTitle
      noticeStatus
      noticeContent
      memberId
      noticeViews
      createdAt
      updatedAt
    }
  }
`;

export const REMOVE_NOTICE_BY_ADMIN = gql`
  mutation RemoveNoticeByAdmin($input: String!) {
    removeNoticeByAdmin(input: $input) {
      _id
      noticeTitle
      noticeStatus
      noticeContent
      memberId
      noticeViews
      createdAt
      updatedAt
    }
  }
`;

export const CREATE_FAQ = gql`
  mutation CreateFaq($input: FaqInput!) {
    createFaq(input: $input) {
      _id
      question
      answer
      category
      memberId
      order
      isActive
      createdAt
      updatedAt
    }
  }
`;

export const UPDATE_FAQ = gql`
  mutation UpdateFaq($input: UpdateFaq!) {
    updateFaq(input: $input) {
      _id
      question
      answer
      category
      memberId
      order
      isActive
      createdAt
      updatedAt
    }
  }
`;

export const REMOVE_FAQ_BY_ADMIN = gql`
  mutation RemoveFaqByAdmin($input: String!) {
    removeFaqByAdmin(input: $input) {
      _id
      question
      answer
      category
      memberId
      order
      isActive
      createdAt
      updatedAt
    }
  }
`;

/* -------------------------------------------------------------------------- */
/*                                  CATEGORY                                  */
/* -------------------------------------------------------------------------- */
export const CREATE_CATEGORY = gql`
  mutation CreateCategory($input: CreateCategoryInput!) {
    createCategory(input: $input) {
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
`;

export const UPDATE_CATEGORY = gql`
  mutation UpdateCategory($input: UpdateCategoryInput!) {
    updateCategory(input: $input) {
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
`;
