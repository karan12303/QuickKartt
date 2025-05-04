import React from 'react';
import { Modal, Table, Tabs, Tab, Button } from 'react-bootstrap';
import { FaRuler } from 'react-icons/fa';

const SizeGuide = ({ show, onHide, category }) => {
  // Determine which size charts to show based on product category
  const showFootwearGuide = category === 'Footwear' || category === 'All';
  const showClothingGuide = (
    category === 'Clothing' || 
    category === 'Men\'s Clothing' || 
    category === 'Women\'s Clothing' || 
    category === 'All'
  );

  return (
    <Modal
      show={show}
      onHide={onHide}
      size="lg"
      centered
      className="size-guide-modal"
    >
      <Modal.Header closeButton>
        <Modal.Title className="d-flex align-items-center">
          <FaRuler className="me-2" /> Size Guide
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Tabs defaultActiveKey={showFootwearGuide ? "footwear" : "clothing"} className="mb-4">
          {showFootwearGuide && (
            <Tab eventKey="footwear" title="Footwear Sizes">
              <div className="mb-3">
                <h5>How to Measure Your Foot</h5>
                <ol>
                  <li>Stand on a level floor with your heel against the wall.</li>
                  <li>Place a ruler on the floor aligned with your heel.</li>
                  <li>Measure the distance from the wall to the tip of your longest toe.</li>
                  <li>Use this measurement to find your size in the chart below.</li>
                </ol>
              </div>
              
              <h5>Footwear Size Conversion Chart</h5>
              <Table striped bordered hover responsive>
                <thead>
                  <tr>
                    <th>UK Size</th>
                    <th>US Size</th>
                    <th>EU Size</th>
                    <th>Foot Length (cm)</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>6</td>
                    <td>7</td>
                    <td>40</td>
                    <td>24.5</td>
                  </tr>
                  <tr>
                    <td>7</td>
                    <td>8</td>
                    <td>41</td>
                    <td>25.5</td>
                  </tr>
                  <tr>
                    <td>8</td>
                    <td>9</td>
                    <td>42</td>
                    <td>26.5</td>
                  </tr>
                  <tr>
                    <td>9</td>
                    <td>10</td>
                    <td>43</td>
                    <td>27.5</td>
                  </tr>
                  <tr>
                    <td>10</td>
                    <td>11</td>
                    <td>44</td>
                    <td>28.5</td>
                  </tr>
                  <tr>
                    <td>11</td>
                    <td>12</td>
                    <td>45</td>
                    <td>29.5</td>
                  </tr>
                </tbody>
              </Table>
              
              <div className="mt-4 mb-2">
                <h5>Tips for Finding the Right Fit</h5>
                <ul>
                  <li>If you're between sizes, go for the larger size.</li>
                  <li>Feet tend to swell during the day, so try shoes on in the afternoon.</li>
                  <li>Leave about 1cm of space between your longest toe and the end of the shoe.</li>
                  <li>Different brands may have slight variations in sizing.</li>
                </ul>
              </div>
            </Tab>
          )}
          
          {showClothingGuide && (
            <Tab eventKey="clothing" title="Clothing Sizes">
              <Tabs defaultActiveKey="mens" className="mb-3">
                <Tab eventKey="mens" title="Men's">
                  <h5>Men's Clothing Size Chart (in inches)</h5>
                  <Table striped bordered hover responsive>
                    <thead>
                      <tr>
                        <th>Size</th>
                        <th>Chest</th>
                        <th>Waist</th>
                        <th>Hips</th>
                        <th>Equivalent</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>XS</td>
                        <td>34-36</td>
                        <td>28-30</td>
                        <td>34-36</td>
                        <td>36</td>
                      </tr>
                      <tr>
                        <td>S</td>
                        <td>36-38</td>
                        <td>30-32</td>
                        <td>36-38</td>
                        <td>38</td>
                      </tr>
                      <tr>
                        <td>M</td>
                        <td>38-40</td>
                        <td>32-34</td>
                        <td>38-40</td>
                        <td>40</td>
                      </tr>
                      <tr>
                        <td>L</td>
                        <td>40-42</td>
                        <td>34-36</td>
                        <td>40-42</td>
                        <td>42</td>
                      </tr>
                      <tr>
                        <td>XL</td>
                        <td>42-44</td>
                        <td>36-38</td>
                        <td>42-44</td>
                        <td>44</td>
                      </tr>
                      <tr>
                        <td>XXL</td>
                        <td>44-46</td>
                        <td>38-40</td>
                        <td>44-46</td>
                        <td>46</td>
                      </tr>
                    </tbody>
                  </Table>
                </Tab>
                <Tab eventKey="womens" title="Women's">
                  <h5>Women's Clothing Size Chart (in inches)</h5>
                  <Table striped bordered hover responsive>
                    <thead>
                      <tr>
                        <th>Size</th>
                        <th>Bust</th>
                        <th>Waist</th>
                        <th>Hips</th>
                        <th>UK/AU</th>
                        <th>EU</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>XS</td>
                        <td>31-33</td>
                        <td>24-26</td>
                        <td>34-36</td>
                        <td>6</td>
                        <td>34</td>
                      </tr>
                      <tr>
                        <td>S</td>
                        <td>33-35</td>
                        <td>26-28</td>
                        <td>36-38</td>
                        <td>8</td>
                        <td>36</td>
                      </tr>
                      <tr>
                        <td>M</td>
                        <td>35-37</td>
                        <td>28-30</td>
                        <td>38-40</td>
                        <td>10</td>
                        <td>38</td>
                      </tr>
                      <tr>
                        <td>L</td>
                        <td>37-39</td>
                        <td>30-32</td>
                        <td>40-42</td>
                        <td>12</td>
                        <td>40</td>
                      </tr>
                      <tr>
                        <td>XL</td>
                        <td>39-41</td>
                        <td>32-34</td>
                        <td>42-44</td>
                        <td>14</td>
                        <td>42</td>
                      </tr>
                      <tr>
                        <td>XXL</td>
                        <td>41-43</td>
                        <td>34-36</td>
                        <td>44-46</td>
                        <td>16</td>
                        <td>44</td>
                      </tr>
                    </tbody>
                  </Table>
                </Tab>
              </Tabs>
              
              <div className="mt-4">
                <h5>How to Measure</h5>
                <ul>
                  <li><strong>Chest/Bust:</strong> Measure around the fullest part of your chest/bust, keeping the tape horizontal.</li>
                  <li><strong>Waist:</strong> Measure around your natural waistline, keeping the tape comfortably loose.</li>
                  <li><strong>Hips:</strong> Measure around the fullest part of your hips, about 8 inches below your waistline.</li>
                </ul>
              </div>
            </Tab>
          )}
        </Tabs>
        
        <div className="text-center mt-4">
          <p className="text-muted">
            These size charts are for reference only. Actual sizes may vary by brand, style, and design.
          </p>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default SizeGuide;
