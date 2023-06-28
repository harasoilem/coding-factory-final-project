export class Paginated<T> {
  count = 0;
  next: string = null;
  previous: string = null;
  results: Array<T> = [];
}

