
import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { CreditCard, Download, ExternalLink } from 'lucide-react';
import { toast } from 'sonner';

interface Invoice {
  id: string;
  date: string;
  amount: string;
  plan: string;
  status: 'paid' | 'pending' | 'failed';
  pdfUrl: string;
}

export const BillingSection = () => {
  // Mock data - in a real app, this would come from your API
  const paymentMethod = {
    brand: 'visa',
    last4: '4242',
    expMonth: 12,
    expYear: 2025
  };

  const invoices: Invoice[] = [
    { 
      id: 'INV-001', 
      date: '2025-03-01', 
      amount: '$49.00', 
      plan: 'Pro', 
      status: 'paid', 
      pdfUrl: '#' 
    },
    { 
      id: 'INV-002', 
      date: '2025-02-01', 
      amount: '$49.00', 
      plan: 'Pro', 
      status: 'paid', 
      pdfUrl: '#' 
    },
    { 
      id: 'INV-003', 
      date: '2025-01-01', 
      amount: '$49.00', 
      plan: 'Pro', 
      status: 'paid', 
      pdfUrl: '#' 
    }
  ];

  const handleUpdatePayment = () => {
    toast.info("Redirecting to payment update page...");
    // In a real app, this would redirect to your payment update page
    // window.location.href = "https://billing.stripe.com/update-payment/your-session-id";
  };

  const handleDownloadInvoice = (invoice: Invoice) => {
    toast.success(`Downloading invoice ${invoice.id}`);
  };

  const handleDownloadAllInvoices = () => {
    toast.success("Downloading all invoices as CSV");
  };
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
        return 'text-green-500';
      case 'pending':
        return 'text-amber-500';
      case 'failed':
        return 'text-red-500';
      default:
        return '';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <span>Billing & Invoices</span>
        </CardTitle>
        <CardDescription>
          Manage your payment methods and view invoice history
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {paymentMethod ? (
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Payment Method</h3>
            <div className="flex items-center gap-4 p-4 border border-border rounded-md">
              <div className="bg-card p-2 rounded">
                <CreditCard className="h-6 w-6 text-muted-foreground" />
              </div>
              <div>
                <p className="font-medium capitalize">{paymentMethod.brand} •••• {paymentMethod.last4}</p>
                <p className="text-sm text-muted-foreground">
                  Expires {paymentMethod.expMonth}/{paymentMethod.expYear}
                </p>
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                className="ml-auto"
                onClick={handleUpdatePayment}
              >
                Update
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Payment Method</h3>
            <p className="text-muted-foreground">No payment method on file.</p>
            <Button variant="outline" onClick={handleUpdatePayment}>
              Add Payment Method
            </Button>
          </div>
        )}

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium">Invoice History</h3>
            <Button 
              variant="outline" 
              size="sm" 
              className="flex items-center gap-1"
              onClick={handleDownloadAllInvoices}
            >
              <Download className="h-4 w-4" />
              Download CSV
            </Button>
          </div>

          {invoices.length > 0 ? (
            <div className="border border-border rounded-md overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead className="hidden sm:table-cell">Plan</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Download</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {invoices.map((invoice) => (
                    <TableRow key={invoice.id}>
                      <TableCell>{new Date(invoice.date).toLocaleDateString()}</TableCell>
                      <TableCell>{invoice.amount}</TableCell>
                      <TableCell className="hidden sm:table-cell">{invoice.plan}</TableCell>
                      <TableCell>
                        <span className={getStatusColor(invoice.status)}>
                          {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          className="h-8 w-8 p-0"
                          onClick={() => handleDownloadInvoice(invoice)}
                        >
                          <span className="sr-only">Download</span>
                          <Download className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <p className="text-muted-foreground">No invoices yet.</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
