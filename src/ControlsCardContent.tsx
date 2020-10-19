import React from 'react';
import Card from '@material-ui/core/Card';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import useStyles from './useStyles';
import * as d3 from 'd3';

const ControlsCardContent = (props: {
    icon: JSX.Element;
    header: string;
    file: Array<object>;
    column: string;
}): JSX.Element => {
    const classes = useStyles();

    /**
     * Takes a file and relevant column name and returns obj counting all keys
     *
     * @param {[object]} file
     * @param {string} column
     * @returns {[object]}
     */
    const countColumnValues = (file: Array<object>, column: string): Array<object> => {
        const dataCount = d3
            .nest()
            .key(function(d: any): any {
                return d[column];
            })
            .rollup(function(leaves: any): any {
                return leaves.length;
            })
            .entries(file);

        return dataCount;
    };

    /**
     * Finds the column in the data and returns the count for a given key
     *
     * @param {string} column
     * @param {string} key
     * @return {integer} value
     */
    const generateCardMetric = (file: Array<object>, column: string, key: string): string => {
        const countData = countColumnValues(file, column);
        const fieldCount = countData.filter(el => {
            return el['key'] === key;
        });

        if (fieldCount[0] !== undefined) {
            console.log(fieldCount);
            return fieldCount[0]['value'].toString();
        }

        return '0';
    };

    return (
        <div>
            <Card className={classes.cardRoot}>
                <CardMedia className={classes.cardMedia}>{props.icon}</CardMedia>
                <CardContent>
                    <Typography variant="h4" className={classes.title} color="primary">
                        {props.header}
                    </Typography>
                    <Typography variant="h2" className={classes.title} color="secondary">
                        {generateCardMetric(props.file, props.column, props.header)}
                    </Typography>
                </CardContent>
            </Card>
        </div>
    );
};

export default ControlsCardContent;
