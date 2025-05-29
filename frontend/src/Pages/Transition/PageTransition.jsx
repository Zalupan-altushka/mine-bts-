import './PageTransition.css'
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import React from 'react';

const PageTransition = ({ children, location }) => {
    return (
        <TransitionGroup component={null}>
            <CSSTransition
                key={location.pathname}
                timeout={200}
                classNames="fade"
            >
                {children}
            </CSSTransition>
        </TransitionGroup>
    );
};

export default PageTransition;