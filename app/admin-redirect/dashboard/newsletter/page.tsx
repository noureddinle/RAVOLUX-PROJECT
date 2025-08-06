import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export default async function NewsletterPage() {
  const subscribers = await getNewsletterSubscribers()

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-bold">Newsletter Subscribers <span className="text-muted-foreground text-base font-normal">({subscribers.length})</span></h1>
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[50px]">ID</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Subscribed At</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {subscribers.map((subscriber) => (
                <TableRow key={subscriber.id}>
                  <TableCell className="font-medium">{subscriber.id}</TableCell>
                  <TableCell>{subscriber.email}</TableCell>
                  <TableCell>{subscriber.subscribedAt}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
