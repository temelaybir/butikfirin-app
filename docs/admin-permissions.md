# Admin Permission System

## Roles and Permissions

### Super Admin (`super_admin`)
Full access to all admin features:
- Manage products (create, edit, delete)
- Manage categories
- Manage orders
- View reports
- Manage users
- Manage settings
- Manage theme
- Manage pages
- Manage content
- Export data

### Admin (`admin`)
Limited access for daily operations:
- Manage products (create, edit, delete)
- Manage categories
- Manage orders
- View reports

## Implementation

### Database Structure

1. `admin_users` table with role and permissions columns
2. `admin_role_permissions` table mapping roles to permissions

### Usage in Components

Use the `PermissionCheck` component to conditionally render UI elements:

```tsx
import { PermissionCheck } from '@/components/admin/permission-check'

<PermissionCheck permission="manage_users">
  <Button>Edit Users</Button>
</PermissionCheck>
```

### Usage in Hooks

Use the `useAdminPermission` hook to check permissions in components:

```tsx
import { useAdminPermission } from '@/hooks/use-admin-permission'

export default function MyComponent() {
  const { hasPermission, loading } = useAdminPermission('manage_users')
  
  if (loading) return <div>Loading...</div>
  
  return (
    {hasPermission && <Button>Edit Users</Button>}
  )
}
```

### Usage in API Routes

Use the `withAdminAuth` function to protect API routes:

```ts
import { withAdminAuth } from '@/lib/admin-auth'

export async function GET(request: NextRequest) {
  return withAdminAuth(async (user) => {
    // Only accessible to authenticated admins
    return NextResponse.json({ message: 'Protected data' })
  })
}
```

### Usage in Server Components

Use the `validateAdminSession` function in server components:

```ts
import { validateAdminSession } from '@/lib/admin-auth'

export default async function AdminPage() {
  const { success, user } = await validateAdminSession()
  
  if (!success || !user) {
    // Redirect to login
    redirect('/admin/login')
  }
  
  return <div>Protected content for {user.username}</div>
}
```