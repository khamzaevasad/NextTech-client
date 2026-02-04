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
