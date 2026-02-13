# 🔐 Phase 2: Auth Module Implementation Plan

We will build the **Auth Module** in sequential "Chapters". Each chapter focuses on a specific layer of the system, ensuring testability and modularity.

## 📚 Chapter 1: The Blueprint (Domain Modeling)
**Goal**: Define the core data structures and interfaces that the entire system will rely on.
- **Tasks**:
    - [ ] Create `registry/auth/types.ts`.
    - [ ] Define `User` interface.
    - [ ] Define `Role` and `Permission` types.
    - [ ] Define `AuthResult` and error types.
- **Outcome**: A solid type system to prevent future bugs.

## 🛡️ Chapter 2: The Shield (Cryptography & Tokens)
**Goal**: Implement the security primitives for passwords and sessions.
- **Tasks**:
    - [ ] Install `bcryptjs` and `jsonwebtoken`.
    - [ ] Create `registry/auth/utils/password.ts` (Hashing & Verification).
    - [ ] Create `registry/auth/utils/jwt.ts` (Signing & Verifying tokens).
    - [ ] Write Unit Tests for both.
- **Outcome**: Secure helper functions to handle sensitive data.

## 👮 Chapter 3: The Guard (RBAC System)
**Goal**: Implement the logic that decides "Who can do what".
- **Tasks**:
    - [ ] Create `registry/auth/rbac.ts`.
    - [ ] Implement `hasPermission(user, resource, action)`.
    - [ ] Implement role hierarchy logic (optional but good).
    - [ ] Write Unit Tests.
- **Outcome**: A reusable function to protect any resource.

## 🧠 Chapter 4: The Core (Auth Service)
**Goal**: Bring it all together into a service that handles business logic.
- **Tasks**:
    - [ ] Create `registry/auth/service.ts`.
    - [ ] Implement `register()`, `login()`, `logout()`.
    - [ ] Integrate Password hashing and JWT issuance.
- **Outcome**: A fully functional Auth Service class ready to be used in API routes.

## 🔌 Chapter 5: integration (Next.js API)
**Goal**: Expose the service via HTTP endpoints.
- **Tasks**:
    - [ ] Create `/api/auth/login` route.
    - [ ] Create `/api/auth/me` route (protected).
    - [ ] Verify flow with Postman/Curl.
