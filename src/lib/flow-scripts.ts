// Flow Cadence scripts and transactions for the Learning Platform

export const SCRIPTS = {
  GET_USER_PROFILE: `
    import LearningPlatform from 0xLearningPlatform

    pub fun main(userAddress: Address): LearningPlatform.UserProfile? {
      return LearningPlatform.getUserProfile(userAddress: userAddress)
    }
  `,

  GET_ACHIEVEMENT: `
    import LearningPlatform from 0xLearningPlatform

    pub fun main(achievementId: UInt64): LearningPlatform.Achievement? {
      return LearningPlatform.getAchievement(achievementId: achievementId)
    }
  `,

  GET_ALL_ACHIEVEMENTS: `
    import LearningPlatform from 0xLearningPlatform

    pub fun main(): {UInt64: LearningPlatform.Achievement} {
      return LearningPlatform.getAllAchievements()
    }
  `,

  GET_CERTIFICATE: `
    import LearningPlatform from 0xLearningPlatform

    pub fun main(certificateId: UInt64): LearningPlatform.Certificate? {
      return LearningPlatform.getCertificate(certificateId: certificateId)
    }
  `
};

export const TRANSACTIONS = {
  CREATE_USER_PROFILE: `
    import LearningPlatform from 0xLearningPlatform

    transaction(name: String, bio: String, avatarUrl: String) {
      prepare(acct: AuthAccount) {}
      
      execute {
        let success = LearningPlatform.createUserProfile(
          name: name,
          bio: bio,
          avatarUrl: avatarUrl
        )
        
        if !success {
          panic("Failed to create user profile")
        }
      }
    }
  `,

  UPDATE_USER_PROFILE: `
    import LearningPlatform from 0xLearningPlatform

    transaction(name: String, bio: String, avatarUrl: String) {
      prepare(acct: AuthAccount) {}
      
      execute {
        let success = LearningPlatform.updateUserProfile(
          name: name,
          bio: bio,
          avatarUrl: avatarUrl
        )
        
        if !success {
          panic("Failed to update user profile")
        }
      }
    }
  `,

  UNLOCK_ACHIEVEMENT: `
    import LearningPlatform from 0xLearningPlatform

    transaction(userAddress: Address, achievementId: UInt64) {
      prepare(acct: AuthAccount) {}
      
      execute {
        let success = LearningPlatform.unlockAchievement(
          userAddress: userAddress,
          achievementId: achievementId
        )
        
        if !success {
          panic("Failed to unlock achievement")
        }
      }
    }
  `,

  CREATE_ACHIEVEMENT: `
    import LearningPlatform from 0xLearningPlatform

    transaction(title: String, description: String, iconUrl: String, points: UInt64, rarity: String) {
      prepare(acct: AuthAccount) {}
      
      execute {
        let achievementId = LearningPlatform.createAchievement(
          title: title,
          description: description,
          iconUrl: iconUrl,
          points: points,
          rarity: rarity
        )
        
        log("Created achievement with ID: ".concat(achievementId.toString()))
      }
    }
  `,

  ISSUE_CERTIFICATE: `
    import LearningPlatform from 0xLearningPlatform

    transaction(
      userAddress: Address,
      courseName: String,
      description: String,
      issuerName: String,
      validUntil: UFix64?,
      certificateHash: String
    ) {
      prepare(acct: AuthAccount) {}
      
      execute {
        let certificateId = LearningPlatform.issueCertificate(
          userAddress: userAddress,
          courseName: courseName,
          description: description,
          issuerName: issuerName,
          validUntil: validUntil,
          certificateHash: certificateHash
        )
        
        if certificateId == nil {
          panic("Failed to issue certificate")
        }
        
        log("Issued certificate with ID: ".concat(certificateId!.toString()))
      }
    }
  `
};