import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";

export default function SignupPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Sign up</CardTitle>
        <CardDescription>Create an account to get started</CardDescription>
      </CardHeader>
      <CardContent>
        <form>
          <FieldGroup className="gap-y-4">
            {/* TODO: Form controller */}
            <FieldLabel>UserName</FieldLabel>
            <Input placeholder="Khamzaev Asadbek" />
            {/* TODO: Form controller */}
            <FieldLabel>Phone number</FieldLabel>
            <Input placeholder="+821021337177" />

            {/* TODO: Form controller */}
            <FieldLabel>Password</FieldLabel>
            <Input placeholder="*****" type="password" />
            <Button>Sign up</Button>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  );
}
