import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const WeightChart = ({ data }) => {
    // data format expected: { "YYYY-MM-DD": { weight: 70, calories: 500 }, ... }
    // We need to convert it to array: [{ date: "9 Şub", weight: 70 }, ...]

    const formatData = () => {
        if (!data) return [];

        // Sort dates
        const sortedKeys = Object.keys(data).sort();

        // Take last 7 entries for better visualization
        const recentKeys = sortedKeys.slice(-7);

        return recentKeys.map(key => {
            const dateObj = new Date(key);
            const day = dateObj.getDate();
            const month = ["Oca", "Şub", "Mar", "Nis", "May", "Haz", "Tem", "Ağu", "Eyl", "Eki", "Kas", "Ara"][dateObj.getMonth()];

            return {
                name: `${day} ${month}`,
                kilo: data[key].weight || null
            };
        }).filter(item => item.kilo !== null); // Filter out days without weight log
    };

    const chartData = formatData();

    if (chartData.length < 2) {
        return (
            <div style={{ textAlign: 'center', padding: '20px', color: '#888', fontSize: '0.9rem' }}>
                Grafik için en az 2 günlük kilo verisi giriniz.
            </div>
        );
    }

    return (
        <div style={{ width: '100%', height: 200, marginTop: '20px', paddingRight: '20px' }}>
            <h4 style={{ color: '#94a3b8', marginBottom: '10px', fontSize: '0.9rem' }}>Kilo Değişimi</h4>
            <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                    <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} tickMargin={5} />
                    <YAxis domain={['dataMin - 1', 'dataMax + 1']} stroke="#94a3b8" fontSize={12} />
                    <Tooltip
                        contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#f8fafc' }}
                        itemStyle={{ color: '#2dd4bf' }}
                    />
                    <Line type="monotone" dataKey="kilo" stroke="#2dd4bf" strokeWidth={3} dot={{ r: 4, fill: '#2dd4bf' }} activeDot={{ r: 6 }} />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
};

export default WeightChart;
