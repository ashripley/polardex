export interface AttributeModel {
  type: string;
  id: string;
  name: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  meta?: Record<string, any>;
}
