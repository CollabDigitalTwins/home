import { ArcLayer, ArcLayerProps } from '@deck.gl/layers'
import { Accessor, DefaultProps } from '@deck.gl/core'

import type { ShaderModule } from '@luma.gl/shadertools'

const uniformBlock = `\
uniform pulseUniforms {
  float time;
  float pulseLength;
  float baseAlpha;
  float pulseAlpha;
  vec3 pulseColor;
} pulse;
`

type PulseUniformProps = {
  time: number
  pulseLength: number
  baseAlpha: number
  pulseAlpha: number
  pulseColor: [number, number, number]
}

const pulseUniforms = {
  name: 'pulse',
  vs: uniformBlock,
  fs: uniformBlock,
  uniformTypes: {
    time: 'f32',
    pulseLength: 'f32',
    baseAlpha: 'f32',
    pulseAlpha: 'f32',
    pulseColor: 'vec3<f32>',
  },
} as const satisfies ShaderModule<PulseUniformProps>

type _PulseArcLayerProps<DataT = unknown> = {
  /** Offset in [0, 1) of each arc's pulse cycle, so pulses don't move in step. */
  getPhase?: Accessor<DataT, number>
  /** Seconds a pulse takes to travel from source to target. */
  getDuration?: Accessor<DataT, number>
  pulseLength?: number
  baseAlpha?: number
  pulseAlpha?: number
  pulseColor?: [number, number, number]
}

export type PulseArcLayerProps<DataT = unknown> = _PulseArcLayerProps<DataT> & ArcLayerProps<DataT>

const defaultProps: DefaultProps<_PulseArcLayerProps> = {
  getPhase: { type: 'accessor', value: 0 },
  getDuration: { type: 'accessor', value: 4 },
  pulseLength: { type: 'number', value: 0.2 },
  baseAlpha: { type: 'number', value: 0.4 },
  pulseAlpha: { type: 'number', value: 1 },
  pulseColor: { type: 'color', value: [255, 236, 210] },
}

/** ArcLayer with a glowing pulse that travels each arc from source to target on a loop. */
export default class PulseArcLayer<DataT = unknown, ExtraProps = object> extends ArcLayer<
  DataT,
  ExtraProps & Required<_PulseArcLayerProps<DataT>>
> {
  static layerName = 'PulseArcLayer'
  static defaultProps = defaultProps as unknown as DefaultProps<ArcLayerProps<unknown>>

  getShaders() {
    const shaders = super.getShaders()
    shaders.inject = {
      'vs:#decl': `\
in float instancePhase;
in float instanceDuration;
out float vHead;
`,
      'vs:#main-end': `\
vHead = fract(pulse.time / instanceDuration + instancePhase) * (1.0 + pulse.pulseLength);
`,
      'fs:#decl': `\
in float vHead;
`,
      'fs:DECKGL_FILTER_COLOR': `\
if (picking.isActive < 0.5) {
  float behind = vHead - geometry.uv.x;
  float glow = behind >= 0.0 && behind <= pulse.pulseLength ? pow(1.0 - behind / pulse.pulseLength, 2.0) : 0.0;
  color.rgb = mix(color.rgb, pulse.pulseColor, glow * 0.85);
  color.a = max(color.a * pulse.baseAlpha, glow * pulse.pulseAlpha);
  if (color.a <= 0.001) discard;
}
`,
    }
    shaders.modules = [...shaders.modules, pulseUniforms]
    return shaders
  }

  initializeState() {
    super.initializeState()
    this.getAttributeManager()!.addInstanced({
      instancePhase: { size: 1, accessor: 'getPhase' },
      instanceDuration: { size: 1, accessor: 'getDuration' },
    })
  }

  draw(params: Parameters<ArcLayer['draw']>[0]) {
    const { pulseLength, baseAlpha, pulseAlpha, pulseColor } = this.props
    const pulseProps: PulseUniformProps = {
      time: performance.now() / 1000,
      pulseLength,
      baseAlpha,
      pulseAlpha,
      pulseColor: [pulseColor[0] / 255, pulseColor[1] / 255, pulseColor[2] / 255],
    }
    this.state.model!.shaderInputs.setProps({ pulse: pulseProps })
    super.draw(params)
  }
}
