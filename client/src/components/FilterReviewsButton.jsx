import React from 'react';
import PropTypes from 'prop-types';
import * as Styled from './styles/FilterReviewsStyles.jsx';

class FilterReviewsButton extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      clicked: false,
    };
    this.handleFilterClick = this.handleFilterClick.bind(this);
  }

  handleFilterClick(e) {
    const { handleReviewsFilter } = this.props;
    handleReviewsFilter(e.target.name);
    this.setState((state) => ({
      clicked: !state.clicked,
    }));
  }

  render() {
    const { tag } = this.props;
    const addDot = this.state.clicked
      ? (<Styled.FilterDot />)
      : (' ');
    return (
      <Styled.FilterButton name={tag[0]} onClick={this.handleFilterClick}>
        {tag[0]}
        {' '}
        (
        {tag[1]}
        )
        {' '}
        {addDot}
      </Styled.FilterButton>
    );
  }
}

FilterReviewsButton.propTypes = {
  tag: PropTypes.array.isRequired,
  handleReviewsFilter: PropTypes.func.isRequired,
};

export default FilterReviewsButton;