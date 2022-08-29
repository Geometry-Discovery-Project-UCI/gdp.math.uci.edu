import { Layout } from "@/consts";
import { AntdIconProps } from "@ant-design/icons-vue/lib/components/AntdIcon";
import { Component } from "vue";

export interface RouteProps {
  path: string
  name: string
  icon?: Component<AntdIconProps>
  component: Component
  layout?: Layout
}

export interface Contributor {
  name: string
  email: string
  institute?: string
}

export interface Topic {
  name: string
  index: number
  snapshot?: string
  essay?: string
  animationContributors: Contributor[]
  essayContributors: Contributor[]
}

export interface TopicRouteProps {
  index: number
  component: Component
}

export interface Coord {
  x: number;
  y: number;
}
