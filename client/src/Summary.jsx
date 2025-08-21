import {
  Button,
  Checkbox,
  Group,
  ScrollArea,
  Select,
  Stack,
  Table,
  Text,
} from '@mantine/core';
import classes from './Summary.module.css';
import axios from './api/axios';
import { useState, useEffect } from 'react';

export function Summary() {

  const [tuplesScrolled, setTuplesScrolled] = useState(false); 
  const [attributesScrolled, setAttributesScrolled] = useState(false); 

  const [tables, setTables] = useState([]);
  const [selectedTable, setSelectedTable] = useState();
  const [attributes, setAttributes] = useState([]);
  const [selectedAttributes, setSelectedAttributes] = useState([]);
  const [queriedAttributes, setQueriedAttributes] = useState([]);
  const [tuples, setTuples] = useState([]);

  const [mostLikedUsers, setMostLikedUsers] = useState([]);

  useEffect(() => {
    getTables();
    getMostLikedUsers();
  }, []);

  useEffect(() => {
    if (selectedTable !== undefined) {
      getAttributes();
    }
  }, [selectedTable]);

  const getTables = () => {
    axios.get('/table').then(res => {
      setTables(res.data.data);
    }).catch(err => {
      alert(err);
    });
  };

  const getAttributes = () => {
    axios.get(`/table/${selectedTable}`).then(res => {
      setAttributes(res.data.data);
      setSelectedAttributes([]);
    }).catch(err => {
      alert(err);
    });
  };

  const getTuples = () => {
    axios.get(`/table/${selectedTable}/${selectedAttributes.join(',')}`).then(res => {
      setTuples(res.data.data);
      setQueriedAttributes(selectedAttributes);
    }).catch(err => {
      alert(err);
    });
  };

  const getMostLikedUsers = () => {
    axios.get('/summary/mostLiked').then(res => {
      setMostLikedUsers(res.data.data);
    }).catch(err => {
      alert(err);
    });
  }; 

  const toggleCheckbox = (event, attribute) => {
    const checked = event.currentTarget.checked;
    if (checked) {
      setSelectedAttributes([...selectedAttributes, attribute]);
    } else {
      setSelectedAttributes(selectedAttributes.filter((attr) => attr !== attribute));
    }
  };

  const queryTuples = () => {
    if (selectedAttributes.length === 0) {
      alert('Please select at least one attribute before querying.');
    } else {
      getTuples();
    }
  };

  return (
    <Stack gap="xl" pl="xl">
      <Group gap="xl">
        <Stack gap="xl">
          <Select 
            label="Table Name"
            placeholder="Pick value"
            className={classes.tableSelector}
            value={selectedTable}
            data={tables}
            onChange={setSelectedTable}
          />
          <ScrollArea
            h={200}
            type="auto"
            onScrollPositionChange={({ y }) => setAttributesScrolled(y !== 0)}
            mt="sm"
            mb="sm"
          >
            <Table className={classes.attributeSelector}>
              <Table.Thead className={`${classes.stickyHeader} ${attributesScrolled ? classes.scrolled : ''}`}>
                <Table.Tr>
                  <Table.Th>Attribute Name</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {attributes.map((attribute) => (
                  <Table.Tr key={attribute}>
                    <Table.Td>
                      <Group>
                        <Checkbox
                          checked={selectedAttributes.includes(attribute)}
                          onChange={(event) => toggleCheckbox(event, attribute)}/>
                        {attribute}
                      </Group>
                    </Table.Td>
                  </Table.Tr>
                ))}
              </Table.Tbody>
            </Table>
          </ScrollArea>
          <Button className={classes.queryButton} onClick={queryTuples}>
          Query
          </Button>
        </Stack>
        <ScrollArea
          h={400}
          type="auto"
          onScrollPositionChange={({ y }) => setTuplesScrolled(y !== 0)}
          mt="sm"
          mb="sm"
        >
          <Table>
            <Table.Thead className={`${classes.stickyHeader} ${tuplesScrolled ? classes.scrolled : ''}`}>
              <Table.Tr>
                {queriedAttributes.map((attribute) => (
                  <Table.Th key={attribute}>{attribute}</Table.Th>
                ))}
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {tuples.map((tuple, tupleIndex) => (
                <Table.Tr key={tupleIndex}>
                  {tuple.map((val, index) => (
                    <Table.Td key={`${tupleIndex}-${index}`}>{val}</Table.Td>
                  ))}
                </Table.Tr>
              ))}
            </Table.Tbody>
          </Table>
        </ScrollArea>
      </Group>
      <Group gap={64} align='flex-start'>
        <Stack>
          <Text>Users whose average number of likes is greater than the global average</Text>
          <Table>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>Username</Table.Th>
                <Table.Th>Average Likes</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {mostLikedUsers.map((user) => (
                <Table.Tr key={user.user_id}>
                  <Table.Td>{user.username}</Table.Td>
                  <Table.Td>{user.avg_likes}</Table.Td>
                </Table.Tr>
              ))}
            </Table.Tbody>
          </Table>
        </Stack>
      </Group>
    </Stack>
  );
}