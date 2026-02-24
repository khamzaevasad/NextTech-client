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
      productRating
      productRatingCount
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
        productRating
        productRatingCount
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

export const GET_FAVORITES = gql`
  query GetFavorites($input: OrdinaryInquiry!) {
    getFavorites(input: $input) {
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
        }
        productRating
        productRatingCount
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

export const GET_CATEGORY_BY_ID = gql`
  query GetCategoryById($input: String!) {
    getCategoryById(input: $input) {
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

export const GET_VISITED = gql`
  query GetVisited($input: OrdinaryInquiry!) {
    getVisited(input: $input) {
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
        storeLocation
        storeLogo
        storePhone
        meLiked {
          memberId
          likeRefId
          myFavorite
        }
      }
      metaCounter {
        total
      }
    }
  }
`;

export const GET_STORE = gql`
  query GetStore($input: String!) {
    getStore(storeId: $input) {
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
      storePhone
      meLiked {
        memberId
        likeRefId
        myFavorite
      }
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
      storeLogo
    }
  }
`;

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
        storeLocation
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

export const GET_MY_STORE = gql`
  query GetMyStore {
    getMyStore {
      _id
      storeName
      ownerId
      storeDesc
      storeStatus
      storeAddress
      storeLocation
      storeProductsCount
      storeRating
      storeLogo
      storeComments
      storePhone
      storeViews
      storeLikes
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

export const GET_MEMBER = gql`
  query GetMember($input: String!) {
    getMember(memberId: $input) {
      _id
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
      memberType
      storeData {
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
      meFollowed {
        followingId
        followerId
        myFollowing
      }
    }
  }
`;

/* -------------------------------------------------------------------------- */
/*                                  COMMENTS                                  */
/* -------------------------------------------------------------------------- */

export const GET_COMMENTS = gql`
  query GetComments($input: CommentsInquiry!) {
    getComments(input: $input) {
      list {
        _id
        commentStatus
        commentGroup
        commentContent
        commentRefId
        memberId
        createdAt
        updatedAt
        memberData {
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
      metaCounter {
        total
      }
    }
  }
`;

/* -------------------------------------------------------------------------- */
/*                                  ARTICLES                                  */
/* -------------------------------------------------------------------------- */

export const GET_BOARD_ARTICLES = gql`
  query GetBoardArticles($input: BoardArticlesInquiry!) {
    getBoardArticles(articleId: $input) {
      list {
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
        meLiked {
          memberId
          likeRefId
          myFavorite
        }
        memberData {
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
      metaCounter {
        total
      }
    }
  }
`;

export const GET_BOARD_ARTICLE = gql`
  query GetBoardArticle($input: String!) {
    getBoardArticle(articleId: $input) {
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
      meLiked {
        memberId
        likeRefId
        myFavorite
      }
      memberData {
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
        meFollowed {
          followingId
          followerId
          myFollowing
        }
      }
    }
  }
`;

/* -------------------------------------------------------------------------- */
/*                                   FOLLOW                                   */
/* -------------------------------------------------------------------------- */

export const GET_MEMBER_FOLLOWERS = gql`
  query GetMemberFollowers($input: FollowInquiry!) {
    getMemberFollowers(input: $input) {
      list {
        _id
        followingId
        followerId
        createdAt
        updatedAt
        meFollowed {
          followingId
          followerId
          myFollowing
        }
        meLiked {
          memberId
          likeRefId
          myFavorite
        }
        followerData {
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
      metaCounter {
        total
      }
    }
  }
`;

export const GET_MEMBER_FOLLOWINGS = gql`
  query GetMemberFollowings($input: FollowInquiry!) {
    getMemberFollowings(input: $input) {
      metaCounter {
        total
      }
      list {
        _id
        followingId
        followerId
        createdAt
        updatedAt
        followingData {
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
        meFollowed {
          followingId
          followerId
          myFollowing
        }
      }
    }
  }
`;

/* -------------------------------------------------------------------------- */
/*                                   NOTICE                                   */
/* -------------------------------------------------------------------------- */

export const GET_NOTICES = gql`
  query GetNotices($input: NoticeInquiry!) {
    getNotices(input: $input) {
      list {
        _id
        noticeTitle
        noticeStatus
        noticeContent
        memberId
        noticeViews
        createdAt
        updatedAt
        authorData {
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
      metaCounter {
        total
      }
    }
  }
`;

export const GET_NOTICE = gql`
  query GetNotice($input: String!) {
    getNotice(noticeId: $input) {
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

/* -------------------------------------------------------------------------- */
/*                                     FAQ                                    */
/* -------------------------------------------------------------------------- */

export const GET_FAQS = gql`
  query GetFaqs($input: FaqInquiry!) {
    getFaqs(input: $input) {
      list {
        _id
        question
        answer
        category
        memberId
        order
        isActive
        createdAt
        updatedAt
        authorData {
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
      metaCounter {
        total
      }
    }
  }
`;

export const GET_FAQ = gql`
  query GetFaq($input: String!) {
    getFaq(faqId: $input) {
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
