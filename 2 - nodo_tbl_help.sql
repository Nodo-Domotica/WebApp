-- phpMyAdmin SQL Dump
-- version 3.5.2.2
-- http://www.phpmyadmin.net
--
-- Machine: localhost
-- Genereertijd: 08 apr 2015 om 22:04
-- Serverversie: 5.5.27
-- PHP-versie: 5.3.17

SET SQL_MODE="NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

--
-- Databank: `nododom_webappdb`
--

--
-- Gegevens worden uitgevoerd voor tabel `nodo_tbl_help`
--

INSERT INTO `nodo_tbl_help` (`help_key`, `help_text`) VALUES
(1, '<b><big>Unit: </big></b><br><br>\nEvents may be sent to other receipents. This is called a notification. In this page you can specify the notificatoin type and which events to send.\nFirst, enter the source Nodo that is sending the events.<br>\n<br><small>Help id: 1</small>'),
(2, '<b><big>Remote Nodo ID: </big></b><br><br>\n<br>\nSelect the remote Nodo which has to receive events from your Nodo. Ask the owner of the Remote Nodo to specify your Nodo as a '' Trusted Nodo''.\n<br><small>Help id: 2</small>'),
(3, '<b><big>Event from your Nodo: </big></b><br><br>\nIn this field you have to specify the Events that you want to send as a Notifcation. You may use an asteriks ''*'' as a wildcard. \nExamples:<br>\n<ul style="list-style-type:circle">\n  <li>UserEvent 123,0</li>\n  <li>Variable 5,*</li>\n  <li>NewKAKU 10,*</li>\n</ul><br>\nWarning: Do not create a loop by sending back events that you received from a remote Nodo!\n<br><small>Help id: 3</small>'),
(4, 'Helptext 4'),
(5, '<b><big>Event from your Nodo: </big></b><br><br>\nIn this field you have to specify the Events that you want to send as a Notifcation. You may use an asteriks ''*'' as a wildcard. \nExamples:<br>\n<ul style="list-style-type:circle">\n  <li>UserEvent 123,0</li>\n  <li>Variable 5,*</li>\n  <li>NewKAKU 10,*</li>\n</ul><br>\nWarning: Do not create a loop by sending back events that you received from a remote Nodo!\n<br><small>Help id: 5</small>'),
(10, 'Helptext 10'),
(11, 'Helptext 11'),
(12, 'Helptext 12'),
(13, '<b><big>Select groups: </big></b><br><br>\nSelect the group or groups to which the object belongs to.\n<br><small>Help id: 13</small>'),
(14, 'Helptext 14'),
(15, 'Helptext 15'),
(16, 'Helptext 16'),
(17, 'Helptext 17'),
(18, 'Helptext 18'),
(19, '<b><big>Button text: </big></b><br><br>\nButton label to display.\n<br><small>Help id: 19</small>'),
(20, '<b><big>Command to Nodo: </big></b><br><br>\nCommand or event send to the Nodo after the button is pressed. It is also possible to specify more than one command seperated by a semicolon '';''. <br>\n<br><small>Help id: 20</small>'),
(21, '<b><big>Select type: </big></b><br>\nAn object has one or more object-items. There are different types of objects-items. They have their own purpose, usage and layout. Select the object-item type you need. (in some cases, the type preselected).<br>\n<br><small>Help id: 21</small>'),
(22, '<b><big>Command to Nodo: </big></b><br><br>\nAfter moving the slider, the value will be sent to the Nodo. The value is stored in the placeholder [Slider]. For example, if you wish to send a dim-level to a klik-aan-klik-uit device with address 123, you have to use the following command:<br><br>\n''NewKAKUSend 123,[Slider]''<br>\n<br><small>Help id: 22</small>\n'),
(23, '<b><big>Slider text: </big></b><br><br>\nEnter a label for the dim-slider.<br>\n<br><small>Help id: 23</small>'),
(24, '<b><big>Slider minimum value: </big></b><br><br>\nA slider has a range. Here you can specify the lowest value. <br>\n<br><small>Help id: 24</small>'),
(25, '<b><big>Slider Maximum value: </big></b><br><br>\nA slider has a range. Here you can specify the highest value. <br>\n<br><small>Help id: 25</small>'),
(26, '<b><big>Step: </big></b><br><br>\nStep or interval for each time you press a the button.<br>\n<br><small>Help id: 26</small>'),
(27, '<small>Helptext 22</small><br><br>\n\n<small>* for all units</small>\n'),
(28, '<b><big>Value from event for slider state: </big></b><br><br>\nAfter fetching an event, the values in the placeholders [Par1] ... [Par5] can be used to set the spinbox to the right value or state. It is also possible to use these values in a simple calculation.<br>\nExamples \n<ul style="list-style-type:circle">\n  <li>''[Par2]'' set the slider to the value stored in placeholder [Par2]</li>\n  <li>''[Par1] +10'' Use the value in placeholder [Par1] for a calculation and set the slider to the result of this calculation.</li>\n  <li>''123'' Every time the right event passes, the slider is set to the value 123</li>\n</ul><br>\n\n<br><small>Help id: 28</small>'),
(29, '<b><big>Event for slider state: </big></b><br><br>\nSpecify the event to fetch for changing the slider state.<br>\nYou may use one or more wildcards. The values will be stored in the<br>\nplaceholders [Par1], [Par2], [Par3], [Par4] and [Par5]. You can use the values in the placeholders<br>\nfor calculations.\n<ul style="list-style-type:circle">\n  <li>''VariableSet 1,*'': fetch all values from the second parameter where variablenumber is 1 and store this value in the placeholder [Par2]</li>\n  <li>''UserEvent *,*'' : Fetch every event from the unis as specified above and store both values in the userevent in [Par1] and [Par2].</li>\n</ul><br>\n<br><small>Help id: 29</small>'),
(30, '<small>Helptext: 30</small><br><br>\n<small>Use placeholders <b><i>[R],[G],[B]</b></i><br> Example: RGBLedSend 15,[R],[G],[B]</small>'),
(31, ''),
(32, '<small>Helptext: 32</small><br><br>\n\n* for all units'),
(33, '<small>Helptext: 33</small><br><br>\n\nExample; rgbled *,*,*'),
(34, '<small>Helptext: 34</small><br><br>\n\nYou can use; [CMD],[PAR1]...[PAR5]<br>\n\nExample; To set the colorpicker state when the Nodo sends the event RGBLED 128,255,4 type [PAR1],[PAR2],[PAR3] in the field <i>Value from Nodo for colorpicker state:</i>'),
(35, '<b><big>Event from unit: </big></b><br>\nThe value of an indicator can be extracted from a Nodo event. Here you can type the unit-number<br>\nof the Nodo that is sending the events. Type "*" for every Nodo unit.\n<br><small>Help id: 35</small>'),
(36, '<b><big>Event: </big></b><br>\nType the event name you want to fetch. You can use different types<br>\nof events i.e. userevents, variables, KAKU or whatever you <br>\nneed to extract the value from. You may alse need a wildcard ''*'' to catch more than one specific<br>\nevent.<br>\n<br>\n<i>Examples:</i>\n<ul style="list-style-type:circle">\n  <li>"Variable 1,*", fetch all values from variable 1</li>\n  <li>"UserEvent *,255", fetch eveny userevent that ends with 255</li>\n  <li>"Boot *", fetch every boot event</li>\n  <li>"NewKAKU 123,*", fetch the dim-level of KAKU unit 123</li>\n  <li>"* *,*", fetch every event (unlikely that you really need this)</li>\n</ul><br><small>Help id: 36</small>'),
(37, '<b><big>Formula: </big></b><br>\nThis field is optional and can be used to calculate a value. After an event is fetched, the parameters are stored in placeholders. The following placeholders may be used to calculate the value:\n<br>\n<ul style="list-style-type:circle">\n  <li>[Unit]</li>\n  <li>[Cmd]</li>\n  <li>[Par1]</li>\n  <li>[Par2]</li>\n  <li>[Par3]</li>\n  <li>[Par4]</li>\n  <li>[Par5]</li>\n</ul><br>\nNormal operands may be used to calculate, a value like * / + - ( ). After calculation, the result of the calculation is stored in the placeholder [Formula].\n<br><i>Examples:</i>\n<ul style="list-style-type:circle">\n  <li>"3600000/[Par2]"</li>\n</ul><br>\n\n<br><small>Help id: 37</small>'),
(38, '<b><big>Round: </big></b><br>\nRounds the formula to the specified precision. This field is optional.<br>\n<br><small>Help id: 38</small>'),
(39, '<b><big>Indicator text: </big></b><br>\nAfter the event is fetched, the parameters are stored in placeholders. The following placeholders<br>\ncan be used to calculate the value:<br>\n<br>\n<ul style="list-style-type:circle">\n  <li>[Formula]</li>\n  <li>[Date]</li>\n  <li>[Time]</li>\n  <li>[Unit]</li>\n  <li>[Cmd]</li>\n  <li>[Par1]</li>\n  <li>[Par2]</li>\n  <li>[Par3]</li>\n  <li>[Par4]</li>\n  <li>[Par5]</li>\n</ul><br>\n\n<br><i>Examples:</i>\n<ul style="list-style-type:circle">\n  <li>"Temperature outside is [Formula]°C"</li>\n  <li>"Door [Formula] open on [Time]"</li>\n  <li>"Unit [Unit] reboot on [Date]"</li>\n</ul><br>\n\n<br><small>Help id: 39</small>'),
(40, '<b><big>Indicator Icon: </big></b><br>\nAn indicator may have an icon. This icon will be displayed on the line of the object in the main page of the WebApp or in a indicator-placeholder. It is possible to define more than one indicator for one object. The indicator which received the latest Nodo event will be displayed.<br>\n<br><small>Help id: 40</small>'),
(41, ''),
(42, '<b><big>Description: </big></b><br>\nType a discription for this object-item<br>\n<br><small>Help id: 42</small>'),
(43, '<b><big>SpinBox minimum value: </big></b><br><br>\nHere you can define the lowest Spinbox value.<br>\n<br><small>Help id: 43</small>'),
(44, '<b><big>SpinBox maximal value: </big></b><br><br>\nHere you can define the highest Spinbox value.<br>\n<br><small>Help id: 44</small>'),
(45, '<b><big>Step: </big></b><br><br>\nStep or interval for each time you press a the button.<br>\n<br><small>Help id: 45</small>'),
(46, '<b><big>Command to Nodo: </big></b><br><br>\nAfter changing the value by pressing buttons in the spinbox, the WebApp can send this value to the Nodo. In normal cases, the value is assigned to a Nodo variable, but it is also possible to send other events or commands. The value is stored in [Spinbox].<br>\nSome examples:<br>\n<ul style="list-style-type:circle">\n  <li>''VariableSet 1,[Spinbox]'' assigns a value to variable-1 on the Nodo connected to the WebApp.</li>\n  <li>''UserEventSend [Spinbox],0'' Send an UserEvent with the first parameter as specified in the spinbox.</li>\n  <li>''NewKAKUSend 10,[Spinbox]'' dim a lamp to the specified value.</li>\n</ul><br>\n<br><small>Help id: 46</small>\n'),
(47, '<b><big>SpinBox text: </big></b><br><br>\nA SpinBox works like a normal slider, but the layout is slight different. You can use a SpinBox<br>\nfor setting a value with up/down buttons, for example to:<br>\n<ul style="list-style-type:circle">\n  <li>make a thermostat to control your Central Heating system;</li>\n  <li>to set ventilator speed;</li>\n  <li>etc.</li>\n</ul><br>\nThe SpinBox title is displayed above the SpinBox.<br>\n<br><small>Help id: 47</small>'),
(48, '<b><big>Event from unit for spinbox state: </big></b><br><br>\nAfter the WebApp has set a value or state on the Nodo, it is possible that there are<br>\nother causes for changing this value. For example calculations on the Nodo (VariableInc,\nVariableDec, ...) or commands/events vrom other Nodo''s. If these events are forwarded<br>\nthe the WebApp, the WebApp wil set the spinbox to the latest, actual value.<br>\nIn this field, you may specify the source unit for these events.<br>\n<br><small>Help id: 48</small>'),
(49, '<b><big>Event for spinbox state: </big></b><br><br>\nSpecify the event to fetch for changing the spinbox state.<br>\nYou may use one or more wildcards. The values will be stored in the<br>\nplaceholders [Par1], [Par2], [Par3], [Par4] and [Par5]. You can use the values in the placeholders<br>\nfor calculations.\n<ul style="list-style-type:circle">\n  <li>''VariableSet 1,*'': fetch all values from the second parameter where variablenumber is 1 and store this value in the placeholder [Par2]</li>\n  <li>''UserEvent *,*'' : Fetch every event from the unis as specified above and store both values in the userevent in [Par1] and [Par2].</li>\n</ul><br>\n<br><small>Help id: 49</small>'),
(50, '<b><big>Value from event for spinbox state: </big></b><br><br>\nAfter fetching an event, the values in the placeholders [Par1] ... [Par5] can be used to set the spinbox to the right value or state. It is also possible to use these values in a simple calculation.<br>\nExamples \n<ul style="list-style-type:circle">\n  <li>''[Par2]'' set the spinbox to the value stored in placeholder [Par2]</li>\n  <li>''[Par1] +10'' Use the value in placeholder [Par1] for a calculation and set the spinbox to the result of this calculation.</li>\n  <li>''123'' Every time the right event passes, the spinbox is set to the value 123</li>\n</ul><br>\n\n<br><small>Help id: 50</small>'),
(51, '<b>Suffix:<big>: </big></b><br><br>\nSuffix displayed behind the value. This field is optional. Examples:<br>\n<ul style="list-style-type:circle">\n  <li>%</li>\n  <li>HPa</li>\n  <li>KWh</li>\n  <li>Degrees</li>\n</ul><br>\n\n<br><small>Help id: 51</small>'),
(52, '<b><big>Line text: </big></b><br><br>\nDefault, buttons and other object items are positioned depending on the size of the screen. In some cases, it is undesirable that buttons are placed side by side. You can use a line to force the next button to the new line below the previous. The text is optional.\n<br><small>Help id: 52</small>'),
(53, '<b><big>Placeholder title: </big></b><br><br>\nA indicator-placeholder is a line (blank or labeled) reserved for displaying an indicator. An indicator contains an icon, text or calculated value. <br>\n<br><small>Help id: 53</small>'),
(54, ''),
(55, '<b><big>Sensor type: </big></b><br><br>\nSelect the desired sensor type<br>\n<br><small>Help id: 55</small>'),
(56, '<b><big>Sensor description: </big></b><br><br>\nType the sensor description.<br>\nExample: "Outside temperature" <br>\nThe value will be added behind the description.<br>\n\n<br><small>Help id: 56</small>'),
(57, '<b><big>Event from unit: </big></b><br><br>\nHere you can type the unit-number of the Nodo that is sending the variables. Type "*" for every Nodo unit.<br>\n<br><small>Help id: 57</small>'),
(58, '<b><big>Variable nr.:</big></b><br><br>\nType the variable number 1...15 where the sensor stores its value<br>\n\n<br><small>Help id: 58</small>');

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
