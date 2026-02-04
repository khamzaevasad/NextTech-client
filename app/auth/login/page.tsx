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

export default function LoginPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Login</CardTitle>
        <CardDescription>Login to get started right away</CardDescription>
      </CardHeader>
      <CardContent>
        <form>
          <FieldGroup className="gap-y-4">
            {/* TODO: Form controller */}
            <FieldLabel>UserName</FieldLabel>
            <Input placeholder="Khamzaev Asadbek" />

            {/* TODO: Form controller */}
            <FieldLabel>Password</FieldLabel>
            <Input placeholder="*****" type="password" />
            <Button>Login</Button>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  );
}
