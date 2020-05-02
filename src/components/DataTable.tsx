import React from 'react';
import { Table } from 'react-bulma-components';
import NumberFormat from 'react-number-format';
import { MortgageData } from '../common/Types';

type TableProps = {
  data: Array<MortgageData>;
};

function TableNumber(props: { value: number }) {
  return (
    <td style={{ width: '200px' }}>
      <NumberFormat
        style={{ fontSize: '14px' }}
        value={props.value}
        displayType={'text'}
        thousandSeparator={true}
        suffix={'€'}
        decimalScale={2}
      />
    </td>
  );
}

export function DataTable(props: TableProps) {
  return (
    <div>
      <Table striped>
        <thead>
          <tr>
            <th>Month</th>
            <th>Balance</th>
            <th>Gross</th>
            <th>Capital</th>
            <th>Interest</th>
            {/* <th>Remaining</th> */}
            <th>Tax Return</th>
            <th>Net</th>
          </tr>
        </thead>
        <tbody>
          {props.data.map((item, i) => {
            return (
              <tr key={i}>
                <td style={{ width: '40px' }}>{i + 1}</td>
                <TableNumber value={item.balance} />
                <TableNumber value={item.grossPaid} />
                <TableNumber value={item.capitalPaid} />
                <TableNumber value={item.interest} />
                {/* <TableNumber value={item.remaining} /> */}
                <TableNumber value={item.taxReturn} />
                <TableNumber value={item.netPaid} />
              </tr>
            );
          })}
        </tbody>
      </Table>
    </div>
  );
}

// export function DataTable(props: TableProps) {
//   return (
//     <Table striped bordered hover size="sm">
//       <thead>
//         <tr>
//           <th>#</th>
//           <th>Balance</th>
//           <th>Gross Paid</th>
//           <th>Capital Paid</th>
//           <th>Interest Paid</th>
//           {/* <th>Remaining</th> */}
//           <th>Tax Return</th>
//           <th>Net Paid</th>
//         </tr>
//       </thead>
//       <tbody>
//         {props.data.map((item, i) => {
//           return (
//             <tr key={i}>
//               <td style={{ width: '40px' }}>{i + 1}</td>
//               <TableNumber value={item.balance} />
//               <TableNumber value={item.grossPaid} />
//               <TableNumber value={item.capitalPaid} />
//               <TableNumber value={item.interest} />
//               {/* <TableNumber value={item.remaining} /> */}
//               <TableNumber value={item.taxReturn} />
//               <TableNumber value={item.netPaid} />
//             </tr>
//           );
//         })}
//       </tbody>
//     </Table>
//   );
// }
