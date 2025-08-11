import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { getNewsletterSubscribers } from "@/lib/data"

export default async function NewsletterPage() {
  const subscribers = await getNewsletterSubscribers()

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-bold">Newsletter Subscribers <span className="text-muted-foreground text-base font-normal">({subscribers.length})</span></h1>
      <Card className="p-0 border-gray-200 dark:border-gray-700">
        <CardContent className="p-0">
          <Table className="border-gray-200 dark:border-gray-700">
            <TableHeader>
              <TableRow className="border-none">
                <TableHead className="w-[50px] border-none">ID</TableHead>
                <TableHead className="border-none">Email</TableHead>
                <TableHead className="border-none">Subscribed At</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="border-gray-200 dark:border-gray-700">
              {subscribers.map((subscriber) => (
                <TableRow key={subscriber.id}>
                  <TableCell className="font-medium border-b border-gray-200 dark:border-gray-700">{subscriber.id}</TableCell>
                  <TableCell className="border-b border-gray-200 dark:border-gray-700">{subscriber.email}</TableCell>
                  <TableCell className="border-b border-gray-200 dark:border-gray-700">{new Date(subscriber.subscribed_at).toLocaleDateString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
