import React from 'react';
import { Pie } from '@nivo/pie';
import AutoSizer from 'react-virtualized-auto-sizer';
import { generatePie } from './utils/AtreidesDataUtils';

const ResponsivePie = (props: { controlsFile: Array<object>; column: string }): JSX.Element => {
    const data = generatePie(props.controlsFile, props.column);

    return (
        <AutoSizer>
            {({ height, width }): JSX.Element => (
                <Pie
                    data={data}
                    width={width}
                    height={height}
                    margin={{ top: 40, right: 80, bottom: 80, left: 80 }}
                    startAngle={-180}
                    innerRadius={0.5}
                    padAngle={0.7}
                    cornerRadius={3}
                    colors={(d): any => d.color}
                    borderWidth={1}
                    borderColor={{ theme: 'grid.line.stroke' }}
                    radialLabelsSkipAngle={10}
                    radialLabelsTextXOffset={6}
                    radialLabelsTextColor="#333333"
                    radialLabelsLinkOffset={0}
                    radialLabelsLinkDiagonalLength={16}
                    radialLabelsLinkHorizontalLength={24}
                    radialLabelsLinkStrokeWidth={3}
                    radialLabelsLinkColor={{ from: 'color', modifiers: [] }}
                    slicesLabelsSkipAngle={10}
                    slicesLabelsTextColor="#333333"
                    animate={true}
                    motionStiffness={90}
                    motionDamping={15}
                    legends={[
                        {
                            anchor: 'bottom',
                            direction: 'row',
                            translateY: 56,
                            itemWidth: 100,
                            itemHeight: 18,
                            itemTextColor: '#999',
                            symbolSize: 18,
                            symbolShape: 'square',
                            effects: [
                                {
                                    on: 'hover',
                                    style: {
                                        itemTextColor: '#000',
                                    },
                                },
                            ],
                        },
                    ]}
                />
            )}
        </AutoSizer>
    );
};

export default ResponsivePie;
