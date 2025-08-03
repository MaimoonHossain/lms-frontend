import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export function AuthTabs() {
  return (
    <div className='flex w-full max-w-sm flex-col gap-6'>
      <Tabs defaultValue='signup'>
        <TabsList className='grid w-full grid-cols-2'>
          <TabsTrigger value='signup'>Sign Up</TabsTrigger>
          <TabsTrigger value='login'>Log In</TabsTrigger>
        </TabsList>

        {/* Sign Up Tab */}
        <TabsContent value='signup'>
          <Card>
            <CardHeader>
              <CardTitle>Create an Account</CardTitle>
              <CardDescription>
                Enter your details to create a new account.
              </CardDescription>
            </CardHeader>
            <CardContent className='grid gap-4'>
              <div className='grid gap-2'>
                <Label htmlFor='signup-name'>Name</Label>
                <Input id='signup-name' placeholder='Your full name' />
              </div>
              <div className='grid gap-2'>
                <Label htmlFor='signup-email'>Email</Label>
                <Input
                  id='signup-email'
                  type='email'
                  placeholder='you@example.com'
                />
              </div>
              <div className='grid gap-2'>
                <Label htmlFor='signup-password'>Password</Label>
                <Input
                  id='signup-password'
                  type='password'
                  placeholder='••••••••'
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button className='w-full'>Sign Up</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* Log In Tab */}
        <TabsContent value='login'>
          <Card>
            <CardHeader>
              <CardTitle>Welcome Back</CardTitle>
              <CardDescription>
                Enter your credentials to access your account.
              </CardDescription>
            </CardHeader>
            <CardContent className='grid gap-4'>
              <div className='grid gap-2'>
                <Label htmlFor='login-email'>Email</Label>
                <Input
                  id='login-email'
                  type='email'
                  placeholder='you@example.com'
                />
              </div>
              <div className='grid gap-2'>
                <Label htmlFor='login-password'>Password</Label>
                <Input
                  id='login-password'
                  type='password'
                  placeholder='••••••••'
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button className='w-full'>Log In</Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

// rQ1shuhsNlK7ozI9;
