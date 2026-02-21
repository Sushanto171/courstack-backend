

export interface Student {
  name: string;
  email: string;
  phone: string;
}

export interface PaymentParams {
  total_amount: number;
  tran_id: string;
  courseTitle: string;
  student: Student;
}

export interface IipnBody { val_id: string, tran_id: string }