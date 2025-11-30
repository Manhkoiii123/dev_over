import { CreateInvoiceTcpRequest } from '@common/interfaces/tcp/invoice';
import { Invoice } from '@common/schemas/invoice.schema';

export const invoiceRequestMapping = (
  data: CreateInvoiceTcpRequest
): Partial<Invoice> => {
  return {};
};
