
## 🔐 Phase 6: User Roles & Permissions (RBAC)
**Goal**: Implement a robust Role-Based Access Control system to secure routes and resources.
- **Tasks**:
    - [x] Defined `Role` and `Permission` types in `registry/auth/types.ts`.
    - [x] Implemented `hasPermission` logic in `registry/auth/rbac.ts`.
    - [ ] Create a `withPermission` Higher-Order Component (HOC) or hook for client-side protection.
    - [ ] Create middleware logic or checks for server-side route protection.
    - [ ] Update `DashboardPage` to show admin-only content.
- **Outcome**: A secure system where access is strictly controlled by user roles.
