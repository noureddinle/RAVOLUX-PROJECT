import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"

export default function SettingsPage() {
  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-bold">Settings</h1>

      {/* General Settings Section */}
      <Card>
        <CardHeader>
          <CardTitle>General Settings</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="site-name">Website Name</Label>
            <Input id="site-name" placeholder="Acme Lighting" defaultValue="Acme Lighting" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="contact-email">Contact Email</Label>
            <Input id="contact-email" type="email" placeholder="support@acmelighting.com" defaultValue="support@acmelighting.com" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="address">Company Address</Label>
            <Textarea id="address" placeholder="123 Main St, Anytown, USA" defaultValue="123 Main St, Anytown, USA" />
          </div>
          <Button className="w-fit">Save General Settings</Button>
        </CardContent>
      </Card>

      {/* Notification Settings Section */}
      <Card>
        <CardHeader>
          <CardTitle>Notification Settings</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="order-notifications">New Order Notifications</Label>
            <Switch id="order-notifications" defaultChecked />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="stock-alerts">Low Stock Alerts</Label>
            <Switch id="stock-alerts" />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="newsletter-signup-alerts">Newsletter Signup Alerts</Label>
            <Switch id="newsletter-signup-alerts" defaultChecked />
          </div>
          <Button className="w-fit">Save Notification Settings</Button>
        </CardContent>
      </Card>

      {/* Security Settings Section (Placeholder) */}
      <Card>
        <CardHeader>
          <CardTitle>Security Settings</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4">
          <p className="text-muted-foreground">Manage password, two-factor authentication, and API keys here.</p>
          <Button className="w-fit" variant="outline">Go to Security</Button>
        </CardContent>
      </Card>
    </div>
  )
}
