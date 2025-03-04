import { TodoPresenter } from "../presenters/TodoPresenter";
import { TodoView } from "../views/TodoView";

export function TodoFeature() {
  return <TodoPresenter>{(props) => <TodoView {...props} />}</TodoPresenter>;
}
