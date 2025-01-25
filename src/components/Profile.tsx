import { useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"

// In a real app, this would come from an API or context
const user = {
  name: 'John Doe',
  email: 'john@example.com',
  subscription: 'Pro'
}

export function Profile() {
  const [name, setName] = useState(user.name)
  const [email, setEmail] = useState(user.email)

  const handleSave = () => {
    // In a real app, this would update the user's details via an API
    console.log('Saving user details:', { name, email })
  }

  const handleDeleteAccount = () => {
    // In a real app, this would delete the user's account via an API
    console.log('Deleting account')
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Profile</h1>
      <Tabs defaultValue="subscription">
        <TabsList>
          <TabsTrigger value="subscription">Subscription</TabsTrigger>
          <TabsTrigger value="details">Details</TabsTrigger>
        </TabsList>
        <TabsContent value="subscription">
          <Card>
            <CardHeader>
              <CardTitle>Subscription</CardTitle>
              <CardDescription>Manage your subscription plan</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Current plan: {user.subscription}</p>
            </CardContent>
            <CardFooter>
              <Button>Upgrade Plan</Button>
            </CardFooter>
          </Card>
        </TabsContent>
        <TabsContent value="details">
          <Card>
            <CardHeader>
              <CardTitle>User Details</CardTitle>
              <CardDescription>Update your personal information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input id="name" value={name} onChange={(e) => setName(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button onClick={handleSave}>Save Changes</Button>
              <Button variant="destructive" onClick={handleDeleteAccount}>Delete Account</Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

