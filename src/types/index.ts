import { AntdIconProps } from '@ant-design/icons-vue/lib/components/AntdIcon';
import { Component } from 'vue';

export interface RouteProps {
  path: string
  name: string
  icon?: Component<AntdIconProps>
  component: Component
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
  animationContributors: Array<Contributor>
  essayContributors: Array<Contributor>
}
