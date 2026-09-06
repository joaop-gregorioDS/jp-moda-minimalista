import { Counter } from "../models/Counter";

export async function nextId(name: string) {
  const doc = await Counter.findByIdAndUpdate(
    name,
    { $inc: { seq: 1 } },
    { new: true, upsert: true }
  );
  return doc.seq;
}

export async function setCounter(name: string, seq: number) {
  await Counter.findByIdAndUpdate(name, { seq }, { upsert: true });
}
