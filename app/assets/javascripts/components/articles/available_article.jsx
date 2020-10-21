import React from 'react';
import createReactClass from 'create-react-class';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import CourseUtils from '../../utils/course_utils.js';
import { deleteAssignment, claimAssignment } from '../../actions/assignment_actions.js';
import { addNotification } from '../../actions/notification_actions.js';

export const AvailableArticle = createReactClass({
  displayName: 'AvailableArticle',

  propTypes: {
    assignment: PropTypes.object,
    current_user: PropTypes.object,
    course: PropTypes.object,
    addNotification: PropTypes.func,
    deleteAssignment: PropTypes.func,
    claimAssignment: PropTypes.func
  },

  onSelectHandler() {
    const assignment = {
      id: this.props.assignment.id,
      user_id: this.props.current_user.id,
      role: 0
    };

    const title = this.props.assignment.article_title;
    this.props.addNotification({
      message: I18n.t('assignments.article', { title }),
      closable: true,
      type: 'success'
    });

    return this.props.claimAssignment(assignment);
  },

  onRemoveHandler(e) {
    e.preventDefault();

    const assignment = {
      id: this.props.assignment.id,
      course_slug: this.props.course.slug,
      language: this.props.assignment.language,
      project: this.props.assignment.project,
      article_title: this.props.assignment.article_title,
      role: 0
    };

    if (!confirm(I18n.t('assignments.confirm_deletion'))) { return; }
    return this.props.deleteAssignment(assignment);
  },

  render() {
    const className = 'assignment';
    const { assignment } = this.props;
    const article = CourseUtils.articleFromAssignment(assignment, this.props.course.home_wiki);
    const ratingClass = `rating ${assignment.article_rating}`;
    const ratingMobileClass = `${ratingClass} tablet-only`;
    const articleLink = <a onClick={this.stop} href={article.url} target="_blank" className="inline">{article.formatted_title}</a>;

    let actionSelect;
    let actionRemove;
    if (this.props.current_user.isStudent) {
      actionSelect = (
        <button className="button dark" onClick={this.onSelectHandler}>{I18n.t('assignments.select')}</button>
      );
    }

    if (this.props.current_user.isAdvancedRole) {
      actionRemove = (
        <button className="button dark" onClick={this.onRemoveHandler}>{I18n.t('assignments.remove')}</button>
      );
    }

    return (
      <tr className={className}>
        <td className="tooltip-trigger desktop-only-tc">
          <p className="rating_num hidden">{article.rating_num}</p>
          <div className={ratingClass}><p>{article.pretty_rating || '-'}</p></div>
          <div className="tooltip dark">
            <p>{I18n.t(`articles.rating_docs.${assignment.article_rating || '?'}`, { class: assignment.article_rating || '' })}</p>
          </div>
        </td>
        <td>
          <div className={ratingMobileClass}><p>{article.pretty_rating}</p></div>
          <p className="title">
            {articleLink}
          </p>
        </td>
        <td className="table-action-cell">
          {actionSelect}
          {actionRemove}
        </td>
      </tr>
    );
  }
}
);

const mapDispatchToProps = {
  addNotification,
  deleteAssignment,
  claimAssignment
};

export default connect(null, mapDispatchToProps)(AvailableArticle);
