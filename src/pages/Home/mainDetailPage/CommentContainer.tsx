import { CommentContent } from "../components/CommentContent";
import * as React from "react";

export function CommentContainer() {
  return (
    <div className="flex flex-col gap-[1.25rem] p-[1.25rem]">
      <CommentContent
        commentText="dssadsadasdsadsadsadsadsadsdsdasdsadasdsad"
        userName="유저네임"
      />
      <CommentContent
        commentText="dssadsadasdsadsadsadsadsadsdsdasdsadasdsad"
        userName="유저네임"
      />
      <CommentContent
        commentText="dssadsadasdsadsadsadsadsadsdsdasdsadasdsad"
        userName="유저네임"
      />
      <CommentContent
        commentText="dssadsadasdsadsadsadsadsadsdsdasdsadasdsad"
        userName="유저네임"
      />
      <CommentContent
        commentText="dssadsadasdsadsadsadsadsadsdsdasdsadasdsad"
        userName="유저네임"
      />
      <CommentContent
        commentText="dssadsadasdsadsadsadsadsadsdsdasdsadasdsad"
        userName="유저네임"
      />
      <CommentContent
        commentText="dssadsadasdsadsadsadsadsadsdsdasdsadasdsad"
        userName="유저네임"
      />
    </div>
  );
}
