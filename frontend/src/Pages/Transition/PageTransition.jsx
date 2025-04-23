import './PageTransition.css'
import { CSSTransition, TransitionGroup } from 'react-transition-group';

const PageTransition = ({ children, location }) => {
  return (
    <div className="page-transition-container"> {/* Добавьте класс для контейнера */}
      <TransitionGroup>
        <CSSTransition
          key={location.key}
          classNames="fade"
          timeout={200}
        >
          {children}
        </CSSTransition>
      </TransitionGroup>
    </div>
  );
};

export default PageTransition;