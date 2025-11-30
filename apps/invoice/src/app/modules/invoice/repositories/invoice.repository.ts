import { INVOICE_STATUS } from '@common/constants/enum/invoice.enum';
import {
  Invoice,
  InvoiceModel,
  InvoiceModelName,
} from '@common/schemas/invoice.schema';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class InvoiceRepository {
  constructor(
    @InjectModel(InvoiceModelName) private readonly invoiceModel: InvoiceModel
  ) {}

  create(data: Partial<Invoice>) {}
  getById(id: string) {}
  updateById(id: string, data: Partial<Invoice>) {}
  deleteById(id: string) {}
}
